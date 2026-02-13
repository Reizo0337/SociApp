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

export class RemoveUserDto {
  @IsString()
  dni: string;
}
