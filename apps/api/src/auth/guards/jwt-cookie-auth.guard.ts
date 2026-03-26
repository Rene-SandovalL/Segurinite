import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthJwtPayload } from '../auth.types';

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const cookieBag = request.cookies as Record<string, unknown> | undefined;
    const rawToken = cookieBag?.access_token;
    const token = typeof rawToken === 'string' ? rawToken : undefined;

    if (!token) {
      throw new UnauthorizedException('No autenticado');
    }

    try {
      const payload = await this.jwtService.verifyAsync<AuthJwtPayload>(token, {
        secret: this.getAccessSecret(),
      });

      (request as Request & { user: AuthJwtPayload }).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Sesión inválida o expirada');
    }
  }

  private getAccessSecret(): string {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET no está configurado');
    }

    return secret;
  }
}
