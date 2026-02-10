import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';

// TODO: Agregar validación de autenticación y autorización para proteger esta ruta (por ejemplo, usando JWT o sesiones)

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsersData() {
    return this.usersService.getUsersData();
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    console.log('DTO RECIBIDO: ', dto); // debug only.
    return this.usersService.createUser(dto);
  }
}
