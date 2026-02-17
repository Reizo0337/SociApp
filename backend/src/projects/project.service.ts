import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectRepository(Proyecto)
    private readonly projectRepository: Repository<Proyecto>,
  ) { }

  async getProjects() {
    const projects = await this.projectRepository.find({
      relations: ['responsable']
    });
    return projects.map(p => ({
      ...p,
      responsableId: p.responsable ? p.responsable.IdUsuario : null
    }));
  }

  async createProject(createProjectDto: CreateProjectDto) {
    const { responsableId, ...rest } = createProjectDto;
    const projectData = {
      ...rest,
      pdfPath: createProjectDto.pdfPath,
      responsable: responsableId ? { IdUsuario: Number(responsableId) } as any : undefined
    };
    const newProject = this.projectRepository.create(projectData);
    const saved = await this.projectRepository.save(newProject);
    return this.getProjectWithRelation(saved.idProyecto);
  }

  async updateProject(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({ where: { idProyecto: id } });
    if (!project) throw new NotFoundException('Proyecto no encontrado');

    const { responsableId, ...rest } = updateProjectDto;
    const updateData = {
      ...rest,
      responsable: responsableId ? { IdUsuario: Number(responsableId) } as any : undefined
    };

    const updated = this.projectRepository.merge(project, updateData);
    await this.projectRepository.save(updated);
    return this.getProjectWithRelation(id);
  }

  private async getProjectWithRelation(id: number) {
    const p = await this.projectRepository.findOne({
      where: { idProyecto: id },
      relations: ['responsable']
    });
    if (!p) return null;
    return {
      ...p,
      responsableId: p.responsable ? p.responsable.IdUsuario : null
    };
  }

  async deleteProject(id: number) {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    return { success: true };
  }
}