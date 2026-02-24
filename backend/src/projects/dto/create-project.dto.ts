import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsString()
    @IsNotEmpty()
    estado: string;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    responsableId: number; // Recibe ID de Usuario para la relación

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    presupuesto: number;

    @IsString()
    @IsOptional()
    fuenteFinanciacion?: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsString()
    @IsOptional()
    notas?: string;

    @IsArray()
    @IsOptional()
    subproyectos?: string[];

    @IsArray()
    @Type(() => Number)
    @IsNumber({}, { each: true })
    @IsOptional()
    activityIds?: number[];

    @IsArray()
    @IsOptional()
    pdfPath?: string[];
}
