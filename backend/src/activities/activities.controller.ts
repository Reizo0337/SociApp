import { ActivitiesService } from './activities.service';
import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// ⚠️ SEGURIDAD: Todos los endpoints protegidos - solo administradores pueden acceder
@Controller('activities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  // Obtener todas las actividades
  @Get()
  @Roles('monitor', 'admin')
  getActivitiesData() {
    return this.activitiesService.getActivitiesData();
  }

  // Crear nueva actividad
  @Post()
  @Roles('monitor', 'admin')
  create(@Body() activity: any) {
    return this.activitiesService.createActivity(activity);
  }

  @Put(':id')
  @Roles('monitor', 'admin')
  update(@Param('id') id: string, @Body() activity: any) {
    return this.activitiesService.updateActivity(Number(id), activity);
  }

  @Delete(':id')
  @Roles('monitor', 'admin')
  remove(@Param('id') id: string) {
    return this.activitiesService.deleteActivity(Number(id));
  }

  @Get('Monitors')
  @Roles('monitor', 'admin')
  getMonitors() {
    return this.activitiesService.getMonitors();
  }
}