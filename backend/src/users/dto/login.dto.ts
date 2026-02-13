import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  // No imponemos longitud mínima aquí para no bloquear logins antiguos;
  // la política de contraseña fuerte se aplica en el registro.
  password: string;
}
