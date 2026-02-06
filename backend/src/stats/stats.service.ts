import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(private dataSource: DataSource) {}

  async getDashboardStats() {
    try {
      // Una sola query agregada para obtener todos los conteos
      const [stats] = await this.dataSource.query(`
        SELECT
          SUM(CASE WHEN socio = 1 THEN 1 ELSE 0 END) AS "socios",
          SUM(CASE WHEN socio = 2 THEN 1 ELSE 0 END) AS "noSocios",
          (SELECT COUNT(*) FROM actividades) AS "actividades",
          (SELECT COUNT(*) FROM proyectos) AS "proyectos"
        FROM usuarios
      `);

      // Parseo seguro a número
      return {
        socios: parseInt(stats.socios, 10) || 0,
        noSocios: parseInt(stats.noSocios, 10) || 0,
        actividades: parseInt(stats.actividades, 10) || 0,
        proyectos: parseInt(stats.proyectos, 10) || 0,
      };
    } catch (error) {
      this.logger.error('Failed to fetch dashboard stats', error.stack);
      throw error;
    }
  }
}
