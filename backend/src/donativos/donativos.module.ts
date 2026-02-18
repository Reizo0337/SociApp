import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonativosService } from './donativos.service';
import { DonativosController } from './donativos.controller';
import { Donativo } from './donativo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Donativo])],
  controllers: [DonativosController],
  providers: [DonativosService],
})
export class DonativosModule {}
