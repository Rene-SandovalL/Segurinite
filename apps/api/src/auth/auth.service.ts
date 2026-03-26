import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthJwtPayload } from './auth.types';
import { Request, Response } from 'express';
import * as argon2 from 'argon2';

interface UsuarioAuth {
  id: bigint;
  email: string;
  password_hash: string;
  refresh_token_hash: string | null;
  refresh_token_expires_at: Date | null;
}

interface UsuariosDelegateAuth {
  findUnique(args: {
    where: { id?: bigint; email?: string };
  }): Promise<UsuarioAuth | null>;
  update(args: {
    where: { id: bigint };
    data: {
      refresh_token_hash?: string | null;
      refresh_token_expires_at?: Date | null;
    };
  }): Promise<UsuarioAuth>;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto, response: Response): Promise<{ ok: true }> {
    const email = dto.email.trim().toLowerCase();
    const usuarios = this.getUsuariosModel();

    const usuario = await usuarios.findUnique({
      where: { email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValido = await argon2.verify(
      usuario.password_hash,
      dto.password,
    );

    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = this.crearPayload(usuario.id.toString(), usuario.email);
    const accessToken = await this.generarAccessToken(payload);

    this.setAccessCookie(response, accessToken);

    if (dto.rememberMe) {
      await this.generarYGuardarRefresh(payload, usuario.id, response);
    } else {
      await this.limpiarRefreshToken(usuario.id);
      this.clearRefreshCookie(response);
    }

    return { ok: true };
  }

  async refresh(
    refreshToken: string | undefined,
    response: Response,
  ): Promise<{ ok: true }> {
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Sesión expirada. Inicia sesión nuevamente.',
      );
    }

    const usuarios = this.getUsuariosModel();

    const payload = await this.verificarRefreshToken(refreshToken);
    const usuarioId = BigInt(payload.sub);

    const usuario = await usuarios.findUnique({
      where: { id: usuarioId },
    });

    if (
      !usuario ||
      !usuario.refresh_token_hash ||
      !usuario.refresh_token_expires_at ||
      usuario.refresh_token_expires_at.getTime() < Date.now()
    ) {
      throw new UnauthorizedException(
        'Sesión expirada. Inicia sesión nuevamente.',
      );
    }

    const refreshValido = await argon2.verify(
      usuario.refresh_token_hash,
      refreshToken,
    );

    if (!refreshValido) {
      throw new UnauthorizedException(
        'Sesión expirada. Inicia sesión nuevamente.',
      );
    }

    const nuevoPayload = this.crearPayload(
      usuario.id.toString(),
      usuario.email,
    );

    const accessToken = await this.generarAccessToken(nuevoPayload);
    this.setAccessCookie(response, accessToken);
    this.setRefreshCookie(response, refreshToken);

    return { ok: true };
  }

  async logout(request: Request, response: Response): Promise<{ ok: true }> {
    const accessToken = this.obtenerCookie(request, 'access_token');
    const refreshToken = this.obtenerCookie(request, 'refresh_token');

    const userId =
      (await this.extraerSubDeToken(accessToken, this.getAccessSecret())) ??
      (await this.extraerSubDeToken(refreshToken, this.getRefreshSecret()));

    if (userId) {
      await this.limpiarRefreshToken(BigInt(userId));
    }

    this.clearAccessCookie(response);
    this.clearRefreshCookie(response);

    return { ok: true };
  }

  construirPerfil(payload: AuthJwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      rol: payload.rol,
    };
  }

  private async extraerSubDeToken(
    token: string | undefined,
    secret: string,
  ): Promise<string | null> {
    if (!token) {
      return null;
    }

    try {
      const payload = await this.jwtService.verifyAsync<AuthJwtPayload>(token, {
        secret,
      });
      return payload.sub;
    } catch {
      return null;
    }
  }

  private crearPayload(sub: string, email: string): AuthJwtPayload {
    return {
      sub,
      email,
      rol: 'ADMIN',
    };
  }

  private async generarAccessToken(payload: AuthJwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.getAccessSecret(),
      expiresIn: `${this.getAccessTtlMinutes()}m`,
    });
  }

  private async generarRefreshToken(payload: AuthJwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.getRefreshSecret(),
      expiresIn: `${this.getRefreshTtlDays()}d`,
    });
  }

  private async verificarRefreshToken(token: string): Promise<AuthJwtPayload> {
    try {
      return await this.jwtService.verifyAsync<AuthJwtPayload>(token, {
        secret: this.getRefreshSecret(),
      });
    } catch {
      throw new UnauthorizedException(
        'Sesión expirada. Inicia sesión nuevamente.',
      );
    }
  }

  private async generarYGuardarRefresh(
    payload: AuthJwtPayload,
    usuarioId: bigint,
    response: Response,
  ): Promise<void> {
    const usuarios = this.getUsuariosModel();

    const refreshToken = await this.generarRefreshToken(payload);
    const refreshHash = await argon2.hash(refreshToken);
    const expiresAt = new Date(
      Date.now() + this.getRefreshTtlDays() * 24 * 60 * 60 * 1000,
    );

    await usuarios.update({
      where: { id: usuarioId },
      data: {
        refresh_token_hash: refreshHash,
        refresh_token_expires_at: expiresAt,
      },
    });

    this.setRefreshCookie(response, refreshToken);
  }

  private async limpiarRefreshToken(usuarioId: bigint): Promise<void> {
    const usuarios = this.getUsuariosModel();

    await usuarios.update({
      where: { id: usuarioId },
      data: {
        refresh_token_hash: null,
        refresh_token_expires_at: null,
      },
    });
  }

  private setAccessCookie(response: Response, token: string): void {
    response.cookie('access_token', token, {
      httpOnly: true,
      secure: this.esProduccion(),
      sameSite: this.esProduccion() ? 'none' : 'lax',
      path: '/',
      maxAge: this.getAccessTtlMinutes() * 60 * 1000,
    });
  }

  private setRefreshCookie(response: Response, token: string): void {
    response.cookie('refresh_token', token, {
      httpOnly: true,
      secure: this.esProduccion(),
      sameSite: this.esProduccion() ? 'none' : 'lax',
      path: '/',
      maxAge: this.getRefreshTtlDays() * 24 * 60 * 60 * 1000,
    });
  }

  private clearAccessCookie(response: Response): void {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: this.esProduccion(),
      sameSite: this.esProduccion() ? 'none' : 'lax',
      path: '/',
    });
  }

  private clearRefreshCookie(response: Response): void {
    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.esProduccion(),
      sameSite: this.esProduccion() ? 'none' : 'lax',
      path: '/',
    });
  }

  private getAccessSecret(): string {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET no está configurado');
    }

    return secret;
  }

  private getRefreshSecret(): string {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET no está configurado');
    }

    return secret;
  }

  private getAccessTtlMinutes(): number {
    const valor = Number(
      this.configService.get<string>('JWT_ACCESS_TTL_MINUTES') ?? '15',
    );
    return Number.isFinite(valor) && valor > 0 ? valor : 15;
  }

  private getRefreshTtlDays(): number {
    const valor = Number(
      this.configService.get<string>('JWT_REFRESH_TTL_DAYS') ?? '30',
    );
    return Number.isFinite(valor) && valor > 0 ? valor : 30;
  }

  private esProduccion(): boolean {
    return (
      (this.configService.get<string>('NODE_ENV') ?? 'development') ===
      'production'
    );
  }

  private getUsuariosModel(): UsuariosDelegateAuth {
    const prismaConUsuarios = this.prisma as unknown as {
      usuarios: UsuariosDelegateAuth;
    };

    return prismaConUsuarios.usuarios;
  }

  private obtenerCookie(request: Request, key: string): string | undefined {
    const cookieBag = request.cookies as Record<string, unknown> | undefined;
    const raw = cookieBag?.[key];

    return typeof raw === 'string' ? raw : undefined;
  }
}
