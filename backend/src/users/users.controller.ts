import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

// TODO: Agregar validación de autenticación y autorización para proteger esta ruta (por ejemplo, usando JWT o sesiones)

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsersData() {
    return this.usersService.getUsersData();
  }
}
