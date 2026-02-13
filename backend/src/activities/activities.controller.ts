import { ActivitiesService } from './activities.service';
import { Controller, Get, Post, Body, Put, Delete, Param } from '@nestjs/common';

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

  @Put(':id')
  update(@Param('id') id: string, @Body() activity: any) {
    return this.activitiesService.updateActivity(Number(id), activity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitiesService.deleteActivity(Number(id));
  }

  @Get('Monitors')
  getMonitors() {
    return this.activitiesService.getMonitors();
  }
}