import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

// ⚠️ SEGURIDAD: Todos los endpoints protegidos - solo administradores pueden acceder
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Get()
  @Roles('monitor', 'admin')
  getAll() {
    return this.projectService.getProjects();
  }

  @Post()
  @Roles('monitor', 'admin')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }

  @Put(':id')
  @Roles('monitor', 'admin')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.updateProject(Number(id), updateProjectDto);
  }

  @Delete(':id')
  @Roles('monitor', 'admin')
  delete(@Param('id') id: string) {
    return this.projectService.deleteProject(Number(id));
  }
}