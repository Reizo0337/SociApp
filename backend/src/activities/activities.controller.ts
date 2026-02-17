import { ActivitiesService } from './activities.service';
import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

// ⚠️ SEGURIDAD: Todos los endpoints protegidos - solo administradores pueden acceder
@Controller('activities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) { }

  // Obtener todas las actividades
  @Get()
  @Roles('monitor', 'admin')
  getActivitiesData() {
    return this.activitiesService.getActivitiesData();
  }

  // Crear nueva actividad
  @Post()
  @Roles('monitor', 'admin')
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.createActivity(createActivityDto);
  }

  @Put(':id')
  @Roles('monitor', 'admin')
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.updateActivity(Number(id), updateActivityDto);
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

  @Get('Projects')
  @Roles('monitor', 'admin')
  getProjects() {
    return this.activitiesService.getProjects();
  }
}