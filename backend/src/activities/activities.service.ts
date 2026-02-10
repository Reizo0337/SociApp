import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

// Interfaz para tipar las actividades
export interface Activity {        // Opcional, generado por la DB
  name: string;
  place: string;
  horaInicio: string;
  horaFin: string;
  diaSemana: string; // Opcional, generado por la DB
  icon?: string;      // Opcional
}

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  constructor(private dataSource: DataSource) {}

  // Obtener todas las actividades
  async getActivitiesData() {
    try {
      const activities = await this.dataSource.query(`
        SELECT Id, Nombre, Lugar, HoraInicio, HoraFin, DiaSemana, Icon
        FROM actividades
      `);

      return {
        activities: activities.map((activity) => ({
          id: activity.Id,
          name: activity.Nombre,
          place: activity.Lugar,
          horaInicio: activity.HoraInicio,
          horaFin: activity.HoraFin,
          diaSemana: activity.DiaSemana, // Si lo necesitas
          icon: activity.Icon,
        })),
      };
    } catch (error) {
      this.logger.error('Failed to fetch activities data', error instanceof Error ? error.stack : JSON.stringify(error));
      throw error;
    }
  }

  // Crear nueva actividad
  async createActivity(activity: Activity) {
    try {
      activity.name = activity.name.trim();
      activity.place = activity.place.trim();
      
      // Validar campos obligatorios
      if (!activity.name || !activity.place || !activity.horaInicio || !activity.horaFin || !activity.diaSemana) {
        throw new BadRequestException('Todos los campos obligatorios deben estar completos');
      }
      
      if(activity.name.length > 255 || activity.place.length > 255) {
        throw new BadRequestException('Los campos no pueden exceder los 255 caracteres');
      }
      
      // Validar formato de horas y que la hora de inicio no sea mayor que la de fin
      const startMinutes = this.timeToMinutes(activity.horaInicio);
      const endMinutes = this.timeToMinutes(activity.horaFin);
      if (startMinutes >= endMinutes) {
        throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin');
      }
      
      
      // Asegurarse que icon sea string y no null
      const iconValue: string = activity.icon ?? '';

      // Insertar en DB (MySQL)
      const result = await this.dataSource.query(
        `INSERT INTO actividades (Nombre, Lugar, HoraInicio, HoraFin, DiaSemana, Icon) VALUES (?, ?, ?, ?, ?, ?)`,
        [activity.name, activity.place, activity.horaInicio, activity.horaFin, activity.diaSemana, iconValue]
      );

      const insertedId = result.insertId; // MySQL
      return { id: insertedId, ...activity, icon: iconValue };

    } catch (error) {
      this.logger.error(
        'Failed to create activity',
        JSON.stringify(activity),
        error instanceof Error ? error.stack : JSON.stringify(error)
      );
      throw error;
    }
  }

  // Actualizar actividad por id
  async updateActivity(id: number, activity: Activity) {
    try {
      activity.name = activity.name.trim();
      activity.place = activity.place.trim();

      if (!activity.name || !activity.place || !activity.horaInicio || !activity.horaFin || !activity.diaSemana) {
        throw new BadRequestException('Todos los campos obligatorios deben estar completos');
      }

      if (activity.name.length > 255 || activity.place.length > 255) {
        throw new BadRequestException('Los campos no pueden exceder los 255 caracteres');
      }

      const startMinutes = this.timeToMinutes(activity.horaInicio);
      const endMinutes = this.timeToMinutes(activity.horaFin);
      if (startMinutes >= endMinutes) {
        throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin');
      }

      const iconValue: string = activity.icon ?? '';

      await this.dataSource.query(
        `UPDATE actividades SET Nombre = ?, Lugar = ?, HoraInicio = ?, HoraFin = ?, DiaSemana = ?, Icon = ? WHERE Id = ?`,
        [activity.name, activity.place, activity.horaInicio, activity.horaFin, activity.diaSemana, iconValue, id]
      );

      return { id, ...activity, icon: iconValue };
    } catch (error) {
      this.logger.error('Failed to update activity', JSON.stringify({ id, ...activity }), error instanceof Error ? error.stack : JSON.stringify(error));
      throw error;
    }
  }

  // Eliminar actividad por id
  async deleteActivity(id: number) {
    try {
      await this.dataSource.query(`DELETE FROM actividades WHERE Id = ?`, [id]);
      return { success: true };
    } catch (error) {
      this.logger.error('Failed to delete activity', String(id), error instanceof Error ? error.stack : JSON.stringify(error));
      throw error;
    }
  }

  private timeToMinutes(time: string): number {
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
    if (!match) {
      throw new BadRequestException('Formato de hora inválido. Use HH:MM (24 horas)');
    }
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours * 60 + minutes;
  }
}
