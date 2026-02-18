import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateBancoDto {
    @IsString()
    @IsNotEmpty()
    Nombre: string;

    @IsString()
    @IsOptional()
    Direccion?: string;

    @IsNumber()
    @IsOptional()
    CodigoPostal?: number;

    @IsString()
    @IsOptional()
    Poblacion?: string;

    @IsString()
    @IsOptional()
    Pais?: string;

    @IsString()
    @IsOptional()
    Telefono?: string;

    @IsString()
    @IsOptional()
    CodigoNegocio?: string;

    @IsString()
    @IsOptional()
    Referencia_SEPA?: string;

    @IsString()
    @IsNotEmpty()
    IBAN: string;

    @IsString()
    @IsOptional()
    Swift?: string;

    @IsNumber()
    @IsOptional()
    ID?: number;

    @IsNumber()
    @IsOptional()
    idAsociacion?: number;
}
