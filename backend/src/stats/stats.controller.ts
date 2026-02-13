import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// ⚠️ SEGURIDAD: Endpoint protegido - solo administradores pueden ver estadísticas
@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @Roles('monitor', 'admin')
  getStats() {
    return this.statsService.getDashboardStats();
  }
}
