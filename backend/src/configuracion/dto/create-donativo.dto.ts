import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEmail, IsEnum } from 'class-validator';

export enum TipoDonativo {
    DONATIVO = 'Donativo',
    HERENCIA = 'Herencia'
}

export class CreateDonativoDto {
    @IsString()
    @IsNotEmpty()
    Nombre: string;

    @IsString()
    @IsOptional()
    Direccion?: string;

    @IsString()
    @IsOptional()
    Poblacion?: string;

    @IsNumber()
    @IsOptional()
    CP?: number;

    @IsString()
    @IsOptional()
    Pais?: string;

    @IsString()
    @IsOptional()
    Telefono?: string;

    @IsString()
    @IsOptional()
    NIF?: string;

    @IsEmail()
    @IsOptional()
    Email?: string;

    @IsString()
    @IsOptional()
    Notas?: string;

    @IsEnum(TipoDonativo)
    @IsNotEmpty()
    Tipo: string;

    @IsNumber()
    @IsOptional()
    idDonativo?: number;

    @IsNumber()
    @IsOptional()
    idAsociacion?: number;
}
