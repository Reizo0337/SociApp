import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Proyecto } from './project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule { }