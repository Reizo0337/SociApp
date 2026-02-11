import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { EditUserDto } from './edit-user.dto';
import { RemoveUserDto } from './remove-user.dto';

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
    return this.usersService.createUser(dto);
  }

  @Post('edit')
  edit(@Body() dto: EditUserDto) {
    return this.usersService.editUser(dto);
  }

  @Post('delete')
  delete(@Body() dto: RemoveUserDto) {
    return this.usersService.removeUser(dto);
  }
}
