import { Controller, Get } from '@nestjs/common';
import { ActivitiesService } from './activities.service';

// TODO: Agregar validación de autenticación y autorización para proteger esta ruta (por ejemplo, usando JWT o sesiones)

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  getActivitiesData() {
    return this.activitiesService.getActivitiesData();
  }
}
