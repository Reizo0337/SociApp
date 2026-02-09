import { ActivitiesService } from './activities.service';
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  // Obtener todas las actividades
  @Get()
  getActivitiesData() {
    return this.activitiesService.getActivitiesData();
  }

  // Crear nueva actividad
  @Post()
  create(@Body() activity: any) {
    return this.activitiesService.createActivity(activity);
  }
}