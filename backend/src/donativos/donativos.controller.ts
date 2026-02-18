import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { DonativosService } from './donativos.service';
import { CreateDonativoDto } from './dto/create-donativo.dto';
import { UpdateDonativoDto } from './dto/update-donativo.dto';

@Controller('donativos')
export class DonativosController {
  constructor(private readonly donativosService: DonativosService) {}

  @Post()
  create(@Body() createDonativoDto: CreateDonativoDto) {
    return this.donativosService.create(createDonativoDto);
  }

  @Get()
  findAll() {
    return this.donativosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donativosService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDonativoDto: UpdateDonativoDto) {
    return this.donativosService.update(+id, updateDonativoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donativosService.remove(+id);
  }
}
