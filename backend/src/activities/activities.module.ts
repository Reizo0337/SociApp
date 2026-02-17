import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { Activity } from './activity.entity';
import { Proyecto } from '../projects/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Proyecto])],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule { }
