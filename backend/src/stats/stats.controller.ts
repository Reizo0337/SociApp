import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

// TODO: Agregar validación de autenticación y autorización para proteger esta ruta (por ejemplo, usando JWT o sesiones)

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  getStats() {
    return this.statsService.getDashboardStats();
  }
}
