// src/users/dto/register.dto.ts
import {
  IsString,
  IsEmail,
  IsNumber,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class RegisterDto {
  @IsString()
  nombre: string;

  @IsString()
  apellidos: string;

  @IsString()
  password: string;

  @IsString()
  dni: string;

  @IsString()
  direccion: string;

  @IsString()
  CP: string;

  @IsString()
  provincia: string;

  @IsString()
  poblacion: string;

  @IsString()
  pais: string;

  @IsEmail()
  email: string;

  @IsString()
  telefono: string;

  @IsDateString()
  fechaalta: Date;

  @IsOptional()
  @IsDateString()
  fechabaja?: Date;

  @IsString()
  formadepago: string;

  @Type(() => Number)
  @IsNumber()
  cuota: number;

  @IsString()
  categoria: string;

  @IsEnum(['Socio', 'NoSocio'])
  @Transform(({ value }) => {
    if (value === 0) return 'NoSocio';
    if (value === 1) return 'Socio';
    return value;
  })
  socio: 'Socio' | 'NoSocio';
}
