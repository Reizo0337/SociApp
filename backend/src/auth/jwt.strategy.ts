import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { Usuarios as User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

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
      if (!payload.sub || !payload.email) {
        this.logger.warn('[JWT] Payload missing sub or email');
        return null;
      }

      const user = await this.usersService.findById(Number(payload.sub));

      if (!user) {
        this.logger.error(`[JWT] Usuario no encontrado en DB con ID: ${payload.sub}`);
        return null;
      }

      // ⚠️ SEGURIDAD: Verificar que el email en el token coincida con el de la DB
      // Esto evita que si se reciclan IDs (por ejemplo truncando la tabla), 
      // un token antiguo de un usuario borrado de acceso a un nuevo usuario con la misma ID.
      if (user.email !== payload.email) {
        this.logger.error(`[JWT] Mismatch de identidad detectado. Token Email: ${payload.email}, DB Email: ${user.email}`);
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error('[JWT] Error crítico validando usuario:', error);
      return null;
    }
  }
}
