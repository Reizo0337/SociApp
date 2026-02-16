import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Usuarios as User } from '../users/user.entity';
import { RegisterDto } from 'src/users/dto/register.dto';

import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  // 🔹 REGISTER
  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Generar código de verificación de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date();
    verificationExpires.setMinutes(verificationExpires.getMinutes() + 15); // Expire in 15 mins

    // Convert fechaalta string to Date object for database
    const userData = {
      ...dto,
      password: hashedPassword,
      fechaalta: new Date(dto.fechaalta),
      fechabaja: dto.fechabaja ? new Date(dto.fechabaja) : undefined,
      verificationCode,
      verificationExpires,
      isVerified: false,
    };

    const user = await this.usersService.create(userData);

    // Enviar correo de verificación (sin esperar a que termine para no retrasar la respuesta)
    this.mailService.sendVerificationCode(user.email, verificationCode).catch(err => {
      console.error('Failed to send verification email:', err);
    });

    return { message: 'User registered successfully. Please check your email for verification code.' };
  }

  // 🔹 VERIFY EMAIL
  async verifyEmail(email: string, code: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    if (user.isVerified) return { message: 'Email already verified' };

    if (!user.verificationExpires || new Date() > user.verificationExpires) {
      await this.usersService.removeUser({ dni: user.dni });
      throw new UnauthorizedException('El código ha expirado. Su registro ha sido eliminado por seguridad. Por favor, regístrese de nuevo.');
    }

    if (user.verificationCode !== code) {
      throw new UnauthorizedException('Código de verificación incorrecto. Inténtelo de nuevo.');
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationExpires = null;
    await this.usersService.updateVerificationStatus(user.IdUsuario, true);

    return this.generateTokens(user);
  }

  // 🔹 RESEND CODE
  async resendVerificationCode(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    if (user.isVerified) throw new ConflictException('Email already verified');

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date();
    verificationExpires.setMinutes(verificationExpires.getMinutes() + 15);

    user.verificationCode = verificationCode;
    user.verificationExpires = verificationExpires;
    await this.usersService.create(user);

    await this.mailService.sendVerificationCode(user.email, verificationCode);
    return { message: 'Verification code resent successfully' };
  }

  // 🔹 VALIDATE USER
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      if (user.verificationExpires && new Date() > user.verificationExpires) {
        await this.usersService.removeUser({ dni: user.dni });
        throw new UnauthorizedException('Su registro ha expirado por falta de verificación y ha sido eliminado. Por favor, regístrese de nuevo.');
      }
      throw new UnauthorizedException('Por favor, verifique su correo electrónico antes de iniciar sesión.');
    }

    return user;
  }

  // 🔹 LOGIN
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return this.generateTokens(user);
  }

  // 🔹 GENERATE TOKENS
  async generateTokens(user: User) {
    const payload = {
      sub: user.IdUsuario, // 🔥 AQUÍ ESTÁ EL FIX
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // 🔹 REFRESH TOKEN
  async refreshToken(token: string) {
    if (!token) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException();
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
