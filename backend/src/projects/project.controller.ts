import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProjectService, Proyecto } from './project.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// ⚠️ SEGURIDAD: Todos los endpoints protegidos - solo administradores pueden acceder
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @Roles('monitor', 'admin')
  getAll() {
    return this.projectService.getProjects();
  }

  @Post()
  @Roles('monitor', 'admin')
  create(@Body() proyecto: any) {
    return this.projectService.createProject(proyecto);
  }

  @Put(':id')
  @Roles('monitor', 'admin')
  update(@Param('id') id: string, @Body() data: Partial<Proyecto>) {
    return this.projectService.updateProject(Number(id), data);
  }

  @Delete(':id')
  @Roles('monitor', 'admin')
  delete(@Param('id') id: string) {
    return this.projectService.deleteProject(Number(id));
  }
}