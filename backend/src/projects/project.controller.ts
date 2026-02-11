import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProjectService, Proyecto } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getAll() {
    return this.projectService.getProjects();
  }

 @Post()
    create(@Body() proyecto: any) {
    return this.projectService.createProject(proyecto);
}


  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Proyecto>) {
    return this.projectService.updateProject(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.projectService.deleteProject(Number(id));
  }
}