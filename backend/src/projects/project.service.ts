import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Proyecto } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Activity } from '../activities/activity.entity';
import { In } from 'typeorm';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectRepository(Proyecto)
    private readonly projectRepository: Repository<Proyecto>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    private readonly dataSource: DataSource
  ) { }

  async getProjects() {
    const projects = await this.projectRepository.find({
      relations: ['responsable']
    });

    const allActivities = await this.activityRepository.find();

    return projects.map(p => {
      const activityIds = Array.isArray(p.actividades) ? p.actividades : [];
      const detallesActividades = activityIds.map(id => {
        const act = allActivities.find(a => String(a.id) === String(id));
        return act ? { id: act.id, nombre: act.name } : { id: Number(id), nombre: 'Desconocido' };
      });

      return {
        ...p,
        responsableId: p.responsable ? p.responsable.IdUsuario : null,
        detallesActividades
      };
    });
  }

  async getActivities() {
    const activities = await this.projectRepository.find({
      relations: ['Proyecto']
    });
    return activities.map(a => ({
      ...a,
      proyectoId: a.idProyecto
    }));
  }

  async createProject(createProjectDto: CreateProjectDto) {
    const { responsableId, activityIds, ...rest } = createProjectDto;

    const projectData: any = {
      ...rest,
      responsable: responsableId ? { IdUsuario: Number(responsableId) } : undefined,
      actividades: activityIds ? activityIds.map(String) : []
    };

    const newProject = this.projectRepository.create(projectData as any);
    const saved = (await this.projectRepository.save(newProject as any)) as any;
    return this.getProjectWithRelation(saved.idProyecto);
  }

  async updateProject(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({
      where: { idProyecto: id }
    });
    if (!project) throw new NotFoundException('Proyecto no encontrado');

    const { responsableId, activityIds, pdfPath, ...rest } = updateProjectDto;

    let updatedPdfPath = project.pdfPath || [];
    if (pdfPath && Array.isArray(pdfPath)) {
      updatedPdfPath = [...updatedPdfPath, ...pdfPath];
    }

    const updateData: any = {
      ...rest,
      pdfPath: updatedPdfPath,
      responsable: responsableId ? { IdUsuario: Number(responsableId) } : undefined,
    };

    if (activityIds) {
      updateData.actividades = activityIds.map(String);
    }

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

    const activityIds = Array.isArray(p.actividades) ? p.actividades : [];
    const allActivities = await this.activityRepository.find({
      where: { id: In(activityIds.map(Number)) }
    });

    return {
      ...p,
      responsableId: p.responsable ? p.responsable.IdUsuario : null,
      detallesActividades: activityIds.map(id => {
        const act = allActivities.find(a => String(a.id) === String(id));
        return act ? { id: act.id, nombre: act.name } : { id: Number(id), nombre: 'Desconocido' };
      })
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