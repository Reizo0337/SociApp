import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

interface User {
  name: string;
  surname: string;
  dni: string;
  address: string;
  postalCode: string;
  province: string;
  locality: string;
  country: string;
  email: string;
  phone: string;
  registrationDate: Date;
  deregistrationDate: Date | null;
  paymentMethod: string;
  fee: number;
  role: string;
  socio: string;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private dataSource: DataSource) {}

  async getUsersData() {
    try {
      // Una sola query agregada para obtener todos los conteos
      const users = await this.dataSource.query(`
        SELECT nombre, apellidos, dni, direccion, CP, provincia, poblacion, pais, email, telefono, fechaalta, fechabaja, formadepago, cuota, categoria, socio FROM usuarios;
      `);

      // Parseo seguro a número
      return {
        users: users.map(user => ({
          name: user.nombre,
          surname: user.apellidos,
          dni: user.dni,
          address: user.direccion,
          postalCode: user.CP,
          province: user.provincia,
          locality: user.poblacion,
          country: user.pais,
          email: user.email,
          phone: user.telefono,
          registrationDate: user.fechaalta,
          deregistrationDate: user.fechabaja,
          paymentMethod: user.formadepago,
          fee: parseFloat(user.cuota) || 0,
          role: user.categoria,
          socio: user.socio,
        }))
      };
    } catch (error) {
      this.logger.error('Failed to fetch users data');
      throw error;
    }
  }
}
