import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
    @IsNumber()
    @IsOptional()
    id?: number;
}
