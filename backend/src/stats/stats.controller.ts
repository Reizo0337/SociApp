import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// ⚠️ SEGURIDAD: Endpoint protegido - solo administradores pueden ver estadísticas
@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class StatsController {
  constructor(private readonly statsService: StatsService) { }

  @Get()
  @Roles('monitor', 'admin')
  @CacheKey('dashboard_stats')
  @CacheTTL(300000) // 5 minutos
  getStats() {
    return this.statsService.getDashboardStats();
  }
}
