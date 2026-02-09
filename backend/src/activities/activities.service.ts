import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

// Interfaz para tipar las actividades
export interface Activity {        // Opcional, generado por la DB
  name: string;
  place: string;
  horario: string;
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
        SELECT Id, Nombre, Lugar, Horario, Icon
        FROM actividades
      `);

      return {
        activities: activities.map((activity) => ({
          id: activity.Id,
          name: activity.Nombre,
          place: activity.Lugar,
          horario: activity.Horario,
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
    // Validar campos obligatorios
    if (!activity.name || !activity.place || !activity.horario) {
      throw new Error('Todos los campos obligatorios deben estar completos');
    }

    // Asegurarse que icon sea string y no null
    const iconValue: string = activity.icon ?? '';

    // Insertar en DB (MySQL)
    const result = await this.dataSource.query(
      `INSERT INTO actividades (Nombre, Lugar, Horario, Icon) VALUES (?, ?, ?, ?)`,
      [activity.name, activity.place, activity.horario, iconValue]
    );

    const insertedId = result.insertId; // MySQL
    return { id: insertedId, ...activity, icon: iconValue };

  } catch (error) {
    this.logger.error(
      'Failed to create activity',
      JSON.stringify(activity),
      error instanceof Error ? error.stack : JSON.stringify(error)
    );
    throw error; // Esto genera el 500
  }
}
}
