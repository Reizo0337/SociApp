// auth/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Si hay un error o no hay usuario, lanzar excepción
    if (err || !user) {
      // Debug: Log del error para diagnóstico
      if (process.env.NODE_ENV !== 'production') {
        console.log('[DEBUG JwtAuthGuard] Error:', err?.message || info?.message);
        console.log('[DEBUG JwtAuthGuard] User:', user);
        console.log('[DEBUG JwtAuthGuard] Info:', info);
      }
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
