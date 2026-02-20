import { Injectable, Logger, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Activity } from './activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Proyecto } from '../projects/project.entity';

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Proyecto)
    private readonly projectRepository: Repository<Proyecto>,
    private readonly dataSource: DataSource
  ) { }

  // Obtener todas las actividades
  async getActivitiesData() {
    try {
      const activities = await this.activityRepository.find({
        relations: ['monitor'],
      });

      const allProjects = await this.projectRepository.find();

      const activitiesWithProjects = activities.map((activity) => {
        const relatedProjects = allProjects.filter(p =>
          Array.isArray(p.actividades) && p.actividades.includes(String(activity.id))
        );

        return {
          ...activity,
          monitor: activity.monitor ? activity.monitor.nombre : null,
          proyectos: relatedProjects.map(p => ({ id: p.idProyecto, nombre: p.nombre })),
          horaInicio: activity.horaInicio.slice(0, 5),
          horaFin: activity.horaFin.slice(0, 5),
        };
      });

      return {
        activities: activitiesWithProjects,
      };
    } catch (error) {
      this.handleError('Failed to fetch activities data', error);
    }
  }

  // Crear nueva actividad
  async createActivity(createActivityDto: CreateActivityDto) {
    try {
      this.validateActivity(createActivityDto);
      const { projectIds, ...rest } = createActivityDto;

      const newActivity = this.activityRepository.create(rest);
      const saved = await this.activityRepository.save(newActivity);

      if (projectIds && projectIds.length > 0) {
        for (const pid of projectIds) {
          const project = await this.projectRepository.findOne({ where: { idProyecto: Number(pid) } });
          if (project) {
            const currentActivities = Array.isArray(project.actividades) ? project.actividades : [];
            if (!currentActivities.includes(String(saved.id))) {
              project.actividades = [...currentActivities, String(saved.id)];
              await this.projectRepository.save(project);
            }
          }
        }
      }

      const fullActivity = await this.activityRepository.findOne({
        where: { id: saved.id },
        relations: ['monitor']
      });

      const relatedProjects = projectIds && projectIds.length > 0
        ? await this.projectRepository.find({ where: { idProyecto: In(projectIds) } })
        : [];

      return {
        ...fullActivity,
        monitor: fullActivity?.monitor ? fullActivity.monitor.nombre : null,
        proyectos: relatedProjects.map(p => ({ id: p.idProyecto, nombre: p.nombre })),
        horaInicio: fullActivity?.horaInicio.slice(0, 5),
        horaFin: fullActivity?.horaFin.slice(0, 5),
      };
    } catch (error) {
      this.handleError('Failed to create activity', error, createActivityDto);
    }
  }

  // Actualizar actividad por id
  async updateActivity(id: number, updateActivityDto: UpdateActivityDto) {
    try {
      const activity = await this.activityRepository.findOne({
        where: { id }
      });
      if (!activity) throw new NotFoundException('Actividad no encontrada');

      this.validateActivity({ ...activity, ...updateActivityDto } as any);

      const { projectIds, ...rest } = updateActivityDto;
      const updated = this.activityRepository.merge(activity, rest);
      await this.activityRepository.save(updated);

      if (projectIds) {
        // Normalizamos los IDs a números por si vienen como strings
        const selectedProjectIds = projectIds.map(pid => Number(pid));

        // Primero quitar esta actividad de todos los proyectos que ya no la tienen
        const projectsWithActivity = await this.projectRepository.find();
        for (const p of projectsWithActivity) {
          const acts = Array.isArray(p.actividades) ? p.actividades : [];
          const isSelected = selectedProjectIds.includes(Number(p.idProyecto));
          const hasActivity = acts.includes(String(id));

          if (hasActivity && !isSelected) {
            p.actividades = acts.filter(aid => aid !== String(id));
            await this.projectRepository.save(p);
          } else if (!hasActivity && isSelected) {
            p.actividades = [...acts, String(id)];
            await this.projectRepository.save(p);
          }
        }
      }

      const savedActivity = await this.activityRepository.findOne({
        where: { id },
        relations: ['monitor'],
      });

      const allProjects = await this.projectRepository.find();
      const relatedProjects = allProjects.filter(p =>
        Array.isArray(p.actividades) && p.actividades.includes(String(id))
      );

      return {
        ...savedActivity,
        monitor: savedActivity?.monitor ? savedActivity.monitor.nombre : null,
        proyectos: relatedProjects.map(p => ({ id: p.idProyecto, nombre: p.nombre })),
        horaInicio: savedActivity?.horaInicio.slice(0, 5),
        horaFin: savedActivity?.horaFin.slice(0, 5),
      };
    } catch (error) {
      this.handleError('Failed to update activity', error, { id, ...updateActivityDto });
    }
  }

  // Eliminar actividad por id
  async deleteActivity(id: number) {
    try {
      const result = await this.activityRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`No se encontró la actividad con id ${id}`);
      }
      return { success: true };
    } catch (error) {
      this.handleError('Failed to delete activity', error, { id });
    }
  }

  // Obtener solo los nombres de los monitores (Helper)
  async getMonitors() {
    try {
      // Usar query builder o raw query para esto es eficiente
      return this.dataSource.query(
        `SELECT IdUsuario AS id, Nombre AS nombre FROM usuarios WHERE Categoria = 'monitor'`
      );
    } catch (error) {
      this.handleError('Failed to fetch monitors', error);
    }
  }

  async getProjects() {
    try {
      return this.dataSource.query(
        `SELECT idProyecto AS id, nombre AS nombre FROM proyectos`
      );
    } catch (error) {
      this.handleError('Failed to fetch projects', error);
    }
  }

  // Validar actividad
  private validateActivity(activity: CreateActivityDto): void {
    const { name, place, horaInicio, horaFin, diaSemana } = activity;

    if (!name || !place || !horaInicio || !horaFin || !diaSemana) {
      throw new BadRequestException('Todos los campos obligatorios deben estar completos');
    }

    const startMinutes = this.timeToMinutes(horaInicio);
    const endMinutes = this.timeToMinutes(horaFin);
    if (startMinutes >= endMinutes) {
      throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin');
    }
  }

  // Convertir tiempo a minutos
  private timeToMinutes(time: string): number {
    const match = /^([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(time);
    if (!match) {
      // Fallback simple si viene sin formato estricto, aunque la regex arriba cubre HH:MM y HH:MM:SS opcional
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) throw new BadRequestException('Formato de hora inválido');
      return hours * 60 + minutes;
    }
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours * 60 + minutes;
  }

  // Manejo de errores
  private handleError(message: string, error: any, context?: any): never {
    this.logger.error(message, context ? JSON.stringify(context) : '', error instanceof Error ? error.stack : JSON.stringify(error));
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException(message);
  }
}
