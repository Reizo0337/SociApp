import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { CreateDonativoDto } from './dto/create-donativo.dto';
import { UpdateDonativoDto } from './dto/update-donativo.dto';

@Controller('configuracion/datos')
export class ConfiguracionController {
  constructor(private readonly service: ConfiguracionService) { }
  @Get() get() { return this.service.getDatosAsociacion(); }
  @Put() upsert(@Body() data: any) { return this.service.upsertDatosAsociacion(data); }
}

@Controller('configuracion/junta')
export class JuntaController {
  constructor(private readonly service: ConfiguracionService) { }
  @Get() getAll() { return this.service.getJunta(); }
  @Get('cargos') // <-- AÑADE ESTA RUTA
  getCargos() {
    return this.service.getCargos();
  }
  @Get('usuarios-lista') getList() { return this.service.getUsuariosParaJunta(); }
  @Post() add(@Body() data: any) { return this.service.addJunta(data); }
  @Put(':id') update(@Param('id') id: number, @Body() data: any) { return this.service.updateJunta(id, data); }
  @Delete(':id') remove(@Param('id') id: number) { return this.service.deleteJunta(id); }
}

@Controller('configuracion/relaciones')
export class RelacionesController {
  constructor(private readonly service: ConfiguracionService) { }
  @Get() getAll() { return this.service.getRelaciones(); }
  @Post() add(@Body() data: any) { return this.service.addRelacion(data); }
  @Put(':id') update(@Param('id') id: number, @Body() data: any) { return this.service.updateRelacion(id, data); }
  @Delete(':id') remove(@Param('id') id: number) { return this.service.deleteRelacion(id); }
}

@Controller('configuracion/bancos')
export class BancosController {
  constructor(private readonly service: ConfiguracionService) { }
  @Get() getAll() { return this.service.getBancos(); }
  @Post() add(@Body() data: CreateBancoDto) { return this.service.addBancos(data); }
  @Put(':id') update(@Param('id') id: number, @Body() data: UpdateBancoDto) { return this.service.updateBancos(id, data); }
  @Delete(':id') remove(@Param('id') id: number) { return this.service.deleteBancos(id); }
}

@Controller('configuracion/donativos')
export class DonativosController {
  constructor(private readonly service: ConfiguracionService) { }
  @Get() getAll() { return this.service.getDonativos(); }
  @Post() add(@Body() data: CreateDonativoDto) { return this.service.addDonativos(data); }
  @Put(':id') update(@Param('id') id: number, @Body() data: UpdateDonativoDto) { return this.service.updateDonativos(id, data); }
  @Delete(':id') remove(@Param('id') id: number) { return this.service.deleteDonativos(id); }
}