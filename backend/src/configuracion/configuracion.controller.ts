import { Controller, Get, Body, Put, Post } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';

@Controller('configuracion/datos')
export class ConfiguracionController {
  constructor(private readonly configService: ConfiguracionService) {}

  @Get()
  getDatos() {
    return this.configService.getDatosAsociacion();
  }

  @Post()
  saveDatos(@Body() data: any) {
    return this.configService.upsertDatosAsociacion(data);
  }

  @Put()
  updateDatos(@Body() data: any) {
    return this.configService.upsertDatosAsociacion(data);
  }
}