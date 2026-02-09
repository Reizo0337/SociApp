import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

interface Activites {
  name: string;
  registered: number;
  place: string;
}

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  constructor(private dataSource: DataSource) {}

  async getActivitiesData() {
    try {
      // Una sola query agregada para obtener todos los conteos
      const activities = await this.dataSource.query(`
        SELECT Nombre,	Lugar,	Horario from actividades
      `);

      // Parseo seguro a número
      return {
        activities: activities.map(activitie => ({
          name: activities.Nombre,
          horario: activities.Horario,
          place: activities.Lugar,
         }))
      };
    } catch (error) {
      this.logger.error('Failed to fetch activities data');
      throw error;
    }
  }
}
