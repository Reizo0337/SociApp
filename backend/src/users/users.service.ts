import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Usuarios as User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './create-user.dto';
import { EditUserDto } from './edit-user.dto';
import { RemoveUserDto } from './remove-user.dto';

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

      const sortedUsers = users
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map(user => ({
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
        }));

      return { users: sortedUsers };

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

  async editUser(dto: EditUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { dni: dto.dni } });
      if (!user) {
        throw new Error('User not found');
      }
      this.userRepository.merge(user, dto);
      return this.userRepository.save(user);
    } catch (err) {
      this.logger.error('Failed to edit user', err);
      throw err;
    }
  }

  async removeUser(dto: RemoveUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { dni: dto.dni } });
      console.log(user)
      if (!user) {
        throw new Error('User not found');
      }
      await this.userRepository.remove(user);
      return { success: true };
    } catch (err) {
      this.logger.error('Failed to remove user', err);
      throw err;
    }
  }

  async getMonitors() {
    try {
      const monitors = await this.userRepository.find({ where: { categoria: 'monitor' } });
      return monitors.map((monitor) => ({ id: monitor.IdUsuario, nombre: monitor.nombre }));
    } catch (error) {
      this.logger.error('Failed to fetch monitors', error);
      throw error;
    }
  }
}
