import { Module } from '@nestjs/common';
import { ConfiguracionController, JuntaController, RelacionesController } from './configuracion.controller';
import { ConfiguracionService } from './configuracion.service';

@Module({
  controllers: [ConfiguracionController, JuntaController, RelacionesController],
  providers: [ConfiguracionService],
})
export class ConfiguracionModule { }