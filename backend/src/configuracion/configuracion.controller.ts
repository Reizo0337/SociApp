import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';

@Controller('configuracion/datos')
export class ConfiguracionController {
  constructor(private readonly configService: ConfiguracionService) { }

  @Get()
  getDatos() {
    return this.configService.getDatosAsociacion();
  }

  @Post()
  saveOrUpdateDatos(@Body() data: any) {
    return this.configService.upsertDatosAsociacion(data);
  }
}

@Controller('configuracion/junta')
export class JuntaController {
  constructor(private readonly service: ConfiguracionService) { }

  @Get('usuarios-lista')
  async getUsuariosLista() {
    return this.service.getUsuariosParaJunta();
  }

  @Get()
  getAll() {
    return this.service.getJunta();
  }

  @Post()
  add(@Body() data: any) {
    return this.service.addJunta(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.service.updateJunta(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.deleteJunta(id);
  }

  @Get('cargos')
  async getCargos() {
    return this.service.getCargos();
  }
}

@Controller('configuracion/relaciones')
export class RelacionesController {
  constructor(private readonly service: ConfiguracionService) { }

  @Get()
  getAll() {
    return this.service.getRelaciones();
  }

  @Post()
  add(@Body() data: any) {
    return this.service.addRelacion(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.service.updateRelacion(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.deleteRelacion(id);
  }
}