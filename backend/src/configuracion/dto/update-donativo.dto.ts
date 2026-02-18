import { PartialType } from '@nestjs/mapped-types';
import { CreateDonativoDto } from './create-donativo.dto';

export class UpdateDonativoDto extends PartialType(CreateDonativoDto) { }
