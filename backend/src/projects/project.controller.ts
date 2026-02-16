import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';

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
  @UseInterceptors(FileInterceptor('pdf', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'projects'),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(pdf)$/)) {
        return cb(new BadRequestException('Solo se permiten archivos PDF'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  }))
  create(@Body() createProjectDto: CreateProjectDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      createProjectDto.pdfPath = `/uploads/projects/${file.filename}`;
    }
    return this.projectService.createProject(createProjectDto);
  }

  @Put(':id')
  @Roles('monitor', 'admin')
  @UseInterceptors(FileInterceptor('pdf', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'projects'),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(pdf)$/)) {
        return cb(new BadRequestException('Solo se permiten archivos PDF'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  }))
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      updateProjectDto.pdfPath = `/uploads/projects/${file.filename}`;
    }
    return this.projectService.updateProject(Number(id), updateProjectDto);
  }

  @Delete(':id')
  @Roles('monitor', 'admin')
  delete(@Param('id') id: string) {
    return this.projectService.deleteProject(Number(id));
  }
}