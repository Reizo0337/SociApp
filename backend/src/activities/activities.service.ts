import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

// Interfaz para tipar las actividades
export interface Activity {
  id?: number; // ID opcional, generado por la DB
  name: string;
  place: string;
  horaInicio: string;
  horaFin: string;
  diaSemana: string;
  idMonitor?: number; // ID del monitor, necesario para la relación con usuarios
  monitor?: string; // Opcional, generado por la DB
  icon?: string; // Opcional
}

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  constructor(private readonly dataSource: DataSource) {}

  // Obtener todas las actividades
  async getActivitiesData() {
    try {
      const activities = await this.dataSource.query(`
        SELECT 
          a.*, 
          u.Nombre AS Monitor
        FROM actividades a
        JOIN usuarios u ON a.idMonitor = u.IdUsuario;
      `);

      return {
        activities: activities.map((activity) => this.mapActivity(activity)),
      };
    } catch (error) {
      this.handleError('Failed to fetch activities data', error);
    }
  }

  // Crear nueva actividad
  async createActivity(activity: Activity) {
    try {
      this.logger.log(`Datos recibidos para crear actividad: ${JSON.stringify(activity)}`);
      this.validateActivity(activity);

      const iconValue: string = activity.icon ?? '';

      const result = await this.dataSource.query(
        `INSERT INTO actividades (Nombre, Lugar, HoraInicio, HoraFin, DiaSemana, Icon, idMonitor) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [activity.name, activity.place, activity.horaInicio, activity.horaFin, activity.diaSemana, iconValue, activity.idMonitor]
      );

      const insertedId = result.insertId;
      return { id: insertedId, ...activity, icon: iconValue };
    } catch (error) {
      this.handleError('Failed to create activity', error, activity);
    }
  }

  // Actualizar actividad por id, incluyendo el monitor
  async updateActivity(id: number, activity: Activity) {
    try {
      this.logger.log(`Datos recibidos para actualizar actividad con id ${id}: ${JSON.stringify(activity)}`);
      this.validateActivity(activity);

      const iconValue: string = activity.icon ?? '';

      await this.dataSource.query(
        `UPDATE actividades SET Nombre = ?, Lugar = ?, HoraInicio = ?, HoraFin = ?, DiaSemana = ?, Icon = ?, idMonitor = ? WHERE Id = ?`,
        [
          activity.name,
          activity.place,
          activity.horaInicio,
          activity.horaFin,
          activity.diaSemana,
          iconValue,
          activity.idMonitor,
          id,
        ]
      );

      return { id, ...activity, icon: iconValue };
    } catch (error) {
      this.handleError('Failed to update activity', error, { id, ...activity });
    }
  }

  // Eliminar actividad por id, asegurando que se maneje correctamente el monitor
  async deleteActivity(id: number) {
    try {
      this.logger.log(`Intentando eliminar actividad con id ${id}`);
      const result = await this.dataSource.query(`DELETE FROM actividades WHERE Id = ?`, [id]);

      if (result.affectedRows === 0) {
        throw new BadRequestException(`No se encontró la actividad con id ${id}`);
      }

      return { success: true };
    } catch (error) {
      this.handleError('Failed to delete activity', error, { id });
    }
  }

  // Validar actividad
  private validateActivity(activity: Activity): void {
    const { name, place, horaInicio, horaFin, diaSemana } = activity;

    if (!name || !place || !horaInicio || !horaFin || !diaSemana) {
      throw new BadRequestException('Todos los campos obligatorios deben estar completos');
    }

    if (name.trim().length > 255 || place.trim().length > 255) {
      throw new BadRequestException('Los campos no pueden exceder los 255 caracteres');
    }

    const startMinutes = this.timeToMinutes(horaInicio);
    const endMinutes = this.timeToMinutes(horaFin);
    if (startMinutes >= endMinutes) {
      throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin');
    }
  }

  // Convertir tiempo a minutos
  private timeToMinutes(time: string): number {
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
    if (!match) {
      throw new BadRequestException('Formato de hora inválido. Use HH:MM (24 horas)');
    }
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours * 60 + minutes;
  }

  // Mapear actividad desde la base de datos
  private mapActivity(activity: any): Activity {
    return {
      id: activity.Id,
      name: activity.Nombre,
      place: activity.Lugar,
      horaInicio: activity.HoraInicio,
      horaFin: activity.HoraFin,
      diaSemana: activity.DiaSemana,
      idMonitor: activity.idMonitor, // Agregar idMonitor
      monitor: activity.Monitor,
      icon: activity.Icon,
    };
  }

  // Manejo de errores
  private handleError(message: string, error: any, context?: any): never {
    this.logger.error(message, context ? JSON.stringify(context) : '', error instanceof Error ? error.stack : JSON.stringify(error));
    throw new InternalServerErrorException(message);
  }

  // Obtener todos los monitores
  async getMonitors() {
    try {
      const monitors = await this.dataSource.query(
        `SELECT IdUsuario AS id, Nombre AS nombre FROM usuarios WHERE Categoria = 'monitor'`
      );
      return monitors;
    } catch (error) {
      this.handleError('Failed to fetch monitors', error);
    }
  }

  // Asignar un monitor a una actividad
  async assignMonitorToActivity(activityId: number, monitorName: string) {
    try {
      const monitor = await this.dataSource.query(
        `SELECT IdUsuario FROM usuarios WHERE Nombre = ? AND Categoria = 'monitor'`,
        [monitorName]
      );

      if (!monitor.length) {
        throw new BadRequestException(`Monitor with name ${monitorName} not found`);
      }

      const monitorId = monitor[0].IdUsuario;

      await this.dataSource.query(
        `UPDATE actividades SET idMonitor = ? WHERE Id = ?`,
        [monitorId, activityId]
      );

      return { success: true, monitorId };
    } catch (error) {
      this.handleError('Failed to assign monitor to activity', error);
    }
  }

  // Obtener solo los nombres de los monitores
  async getMonitorNames() {
    try {
      const monitors = await this.getMonitors();
      return monitors.map((monitor) => monitor.nombre);
    } catch (error) {
      this.handleError('Failed to fetch monitor names', error);
    }
  }

  // Asignar monitor por nombre
  async assignMonitorByName(activityId: number, monitorName: string) {
    try {
      const monitor = await this.getMonitors();
      const monitorData = monitor.find((m) => m.nombre === monitorName);

      if (!monitorData) {
        throw new BadRequestException(`Monitor with name ${monitorName} not found`);
      }

      await this.assignMonitorToActivity(activityId, monitorData.nombre);
      return { success: true, monitorId: monitorData.id };
    } catch (error) {
      this.handleError('Failed to assign monitor by name', error);
    }
  }
}
