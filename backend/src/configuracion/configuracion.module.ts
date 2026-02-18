import { Module } from '@nestjs/common';
import { ConfiguracionController, JuntaController, RelacionesController, BancosController, DonativosController } from './configuracion.controller';
import { ConfiguracionService } from './configuracion.service';

@Module({
  controllers: [ConfiguracionController, JuntaController, RelacionesController, BancosController, DonativosController],
  providers: [ConfiguracionService],
})
export class ConfiguracionModule { }