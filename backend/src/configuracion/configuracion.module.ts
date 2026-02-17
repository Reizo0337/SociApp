import { Module } from '@nestjs/common';
import { ConfiguracionController, JuntaController } from './configuracion.controller';
import { ConfiguracionService } from './configuracion.service';

@Module({
  controllers: [ConfiguracionController, JuntaController],
  providers: [ConfiguracionService],
})
export class ConfiguracionModule {}