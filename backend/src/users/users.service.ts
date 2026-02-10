import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Usuarios as User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsersData() {
    try {
      const users = await this.userRepository.find();
      return {
        users: users.map(user => ({
          nombre: user.nombre,
          apellidos: user.apellidos,
          dni: user.dni,
          direccion: user.direccion,
          CP: user.CP,
          provincia: user.provincia,
          localidad: user.poblacion,
          pais: user.pais,
          email: user.email,
          telefono: user.telefono,
          fechadealta: user.fechaalta,
          fechadebaja: user.fechabaja,
          formadepago: user.formadepago,
          cuota: Number(user.cuota) || 0,
          categoria: user.categoria,
          socio: user.socio,
        })),
      };
    } catch (error) {
      this.logger.error('Failed to fetch users data', error);
      throw error;
    }
  }

  async createUser(dto: CreateUserDto) {
    try {
      const user = this.userRepository.create(dto);
      return await this.userRepository.save(user);
    } catch (err) {
      this.logger.error('Failed to create user', err);
      throw err;
    }
  }
}
