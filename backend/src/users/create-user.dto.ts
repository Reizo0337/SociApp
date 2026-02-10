import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  nombre: string;

  @IsString()
  apellidos: string;

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
  fechaalta: string;

  @IsOptional()
  @IsDateString()
  fechabaja?: string;

  @IsString()
  formadepago: string;

  @Type(() => Number)
  @IsNumber()
  cuota: number;

  @IsString()
  categoria: string;

  @IsEnum(['Socio', 'NoSocio'])
  @Transform(({ value }) => {
    if (value === 0) return 'NoSocio';  // si frontend envía 0
    if (value === 1) return 'Socio';    // si frontend envía 1
    return value;                        // si ya es 'Socio'/'NoSocio'
  })
  socio: 'Socio' | 'NoSocio';
}
