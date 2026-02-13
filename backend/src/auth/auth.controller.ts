import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  HttpCode,
  Get,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/users/dto/register.dto';
import { LoginDto } from 'src/users/dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔹 REGISTER
  // ⚠️ SEGURIDAD: Rate limiting aplicado para prevenir ataques de fuerza bruta y registro masivo
  @UseGuards(ThrottlerGuard)
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(dto);

    this.setRefreshCookie(res, tokens.refresh_token);

    return { access_token: tokens.access_token };
  }

  // 🔹 LOGIN
  // ⚠️ SEGURIDAD: Rate limiting aplicado para prevenir ataques de fuerza bruta
  @UseGuards(ThrottlerGuard)
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto.email, dto.password);

    this.setRefreshCookie(res, tokens.refresh_token);

    return { access_token: tokens.access_token };
  }

  // 🔹 REFRESH TOKEN
  // ⚠️ SEGURIDAD: Rate limiting aplicado para prevenir abuso del refresh token
  @UseGuards(ThrottlerGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new Error('No refresh token provided');
    }

    const tokens = await this.authService.refreshToken(refreshToken);

    this.setRefreshCookie(res, tokens.refresh_token);

    return { access_token: tokens.access_token };
  }

  // 🔹 LOGOUT
  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    // ⚠️ SEGURIDAD: No devolver el password aunque esté hasheado
    const user = req.user as any;
    if (!user) return null;

    // Crear una copia del usuario sin el password
    const { password, ...userWithoutPassword } = user;

    // Debug: Log de la categoría del usuario (solo en desarrollo)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DEBUG] Usuario categoría:', userWithoutPassword.categoria);
    }

    return userWithoutPassword;
  }

  // 🔹 HELPER: Set refresh token in HttpOnly cookie
  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS obligatorio en producción
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });
  }
}
