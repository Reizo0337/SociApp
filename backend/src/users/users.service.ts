import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Usuarios as User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async getUsersData() {
    try {
      const users = await this.userRepository.find();

      const sortedUsers = users
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map(user => ({
          id: user.IdUsuario,
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

  // auth part
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { IdUsuario: id },
    });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async updateVerificationStatus(userId: number, isVerified: boolean) {
    return this.userRepository.update(userId, {
      isVerified,
      verificationCode: null,
      verificationExpires: null
    });
  }


  // auth part


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
      // ⚠️ SEGURIDAD: No hacer console.log de objetos con datos sensibles
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
