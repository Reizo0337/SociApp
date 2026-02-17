import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Proyecto } from './project.entity';
import { Activity } from '../activities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto, Activity])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule { }