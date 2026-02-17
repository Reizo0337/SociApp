import { Injectable, Logger, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Activity } from './activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    private readonly dataSource: DataSource // Mantener para consultas específicas si es necesario, o eliminar
  ) { }

  // Obtener todas las actividades
  async getActivitiesData() {
    try {
      const activities = await this.activityRepository.find({
        relations: ['monitor', 'proyecto'], // Cargar relación con usuario
      });

      return {
        activities: activities.map((activity) => ({
          ...activity,
          monitor: activity.monitor ? activity.monitor.nombre : null,
          horaInicio: activity.horaInicio.slice(0, 5), // 'HH:MM:SS' -> 'HH:MM'
          horaFin: activity.horaFin.slice(0, 5),
        })),
      };
    } catch (error) {
      this.handleError('Failed to fetch activities data', error);
    }
  }

  // Crear nueva actividad
  async createActivity(createActivityDto: CreateActivityDto) {
    try {
      this.validateActivity(createActivityDto);

      const newActivity = this.activityRepository.create(createActivityDto);
      const saved = await this.activityRepository.save(newActivity);

      const fullActivity = await this.activityRepository.findOne({
        where: { id: saved.id },
        relations: ['monitor', 'proyecto']
      });

      if (!fullActivity) {
        return saved;
      }

      return {
        ...fullActivity,
        monitor: fullActivity.monitor ? fullActivity.monitor.nombre : null,
        proyecto: fullActivity.proyecto ? fullActivity.proyecto.nombre : null,
        horaInicio: fullActivity.horaInicio.slice(0, 5),
        horaFin: fullActivity.horaFin.slice(0, 5),
      };
    } catch (error) {
      this.handleError('Failed to create activity', error, createActivityDto);
    }
  }

  // Actualizar actividad por id
  async updateActivity(id: number, updateActivityDto: UpdateActivityDto) {
    try {
      const activity = await this.activityRepository.findOne({ where: { id } });
      if (!activity) throw new NotFoundException('Actividad no encontrada');

      this.validateActivity({ ...activity, ...updateActivityDto } as CreateActivityDto);

      const updated = this.activityRepository.merge(activity, updateActivityDto);
      await this.activityRepository.save(updated);

      const savedActivity = await this.activityRepository.findOne({
        where: { id },
        relations: ['monitor', 'proyecto'],
      });

      if (!savedActivity) {
        throw new NotFoundException('Error al recuperar la actividad actualizada');
      }

      return {
        ...savedActivity,
        monitor: savedActivity.monitor ? savedActivity.monitor.nombre : null,
        horaInicio: savedActivity.horaInicio.slice(0, 5),
        horaFin: savedActivity.horaFin.slice(0, 5),
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
