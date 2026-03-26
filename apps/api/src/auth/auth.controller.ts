import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtCookieAuthGuard } from './guards/jwt-cookie-auth.guard';
import { AuthJwtPayload } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private obtenerCookie(request: Request, key: string): string | undefined {
    const cookieBag = request.cookies as Record<string, unknown> | undefined;
    const raw = cookieBag?.[key];

    return typeof raw === 'string' ? raw : undefined;
  }

  @Post('login')
  login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ ok: true }> {
    return this.authService.login(loginDto, response);
  }

  @Post('refresh')
  refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ ok: true }> {
    const refreshToken = this.obtenerCookie(request, 'refresh_token');
    return this.authService.refresh(refreshToken, response);
  }

  @UseGuards(JwtCookieAuthGuard)
  @Get('me')
  me(@Req() request: Request & { user: AuthJwtPayload }): {
    id: string;
    email: string;
    rol: 'ADMIN';
  } {
    return this.authService.construirPerfil(request.user);
  }

  @Post('logout')
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ ok: true }> {
    return this.authService.logout(request, response);
  }
}
