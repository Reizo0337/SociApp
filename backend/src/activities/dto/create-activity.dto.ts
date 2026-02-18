import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateActivityDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    place: string;

    @IsString()
    @IsNotEmpty()
    horaInicio: string;

    @IsString()
    @IsNotEmpty()
    horaFin: string;

    @IsString()
    @IsNotEmpty()
    diaSemana: string;

    @IsNumber()
    @IsOptional()
    idMonitor?: number;

    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    projectIds?: number[];

    @IsString()
    @IsOptional()
    icon?: string;
}
