import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// ⚠️ SEGURIDAD: Todos los endpoints protegidos - solo administradores pueden acceder
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('monitor', 'admin')
  getUsersData() {
    return this.usersService.getUsersData();
  }

  @Post()
  @Roles('monitor', 'admin')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Post('edit')
  @Roles('monitor', 'admin')
  edit(@Body() dto: EditUserDto) {
    return this.usersService.editUser(dto);
  }

  @Post('delete')
  @Roles('monitor', 'admin')
  delete(@Body() dto: RemoveUserDto) {
    return this.usersService.removeUser(dto);
  }
}
