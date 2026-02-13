import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { Usuarios as User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    const jwtSecret = process.env.JWT_ACCESS_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_ACCESS_SECRET is not set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any): Promise<User | null> {
    try {
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        // Debug: Log cuando no se encuentra el usuario
        if (process.env.NODE_ENV !== 'production') {
          console.log('[DEBUG JWT] Usuario no encontrado con ID:', payload.sub);
        }
        return null;
      }
      // Debug: Log cuando se encuentra el usuario
      if (process.env.NODE_ENV !== 'production') {
        console.log('[DEBUG JWT] Usuario validado:', user.email, 'Categoría:', user.categoria);
      }
      return user;
    } catch (error) {
      // Debug: Log de errores en la validación
      if (process.env.NODE_ENV !== 'production') {
        console.error('[DEBUG JWT] Error validando usuario:', error);
      }
      return null;
    }
  }
}
