import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ConfiguracionService {
  private readonly logger = new Logger(ConfiguracionService.name);

  constructor(private readonly dataSource: DataSource) { }

  async getDatosAsociacion() {
    try {
      // Seleccionamos de tu tabla 'asociacion'
      const data = await this.dataSource.query(`SELECT * FROM asociacion LIMIT 1`);

      if (!data.length) return null;

      const a = data[0];
      // Mapeamos de DB a los nombres que espera tu frontend (datosSchema)
      return {
        legalName: a.nombre,
        cif: a.CIF,
        address: a.dirección,
        postalCode: a.cp,
        generalPhone: a.teléfono,
        generalEmail: a.email,
        website: a.web,
        nrRegistro: a.nrRegistro,
        logo: a.Logo
      };
    } catch (error) {
      this.handleError('Error al obtener datos de la asociación', error);
    }
  }

  async upsertDatosAsociacion(data: any) {
    try {
      this.validateDatos(data);
      const existing = await this.dataSource.query(`SELECT idAsociacion FROM asociacion LIMIT 1`);

      if (existing.length > 0) {
        // UPDATE usando tus nombres de columna: CIF, nombre, dirección, cp, teléfono, email, web
        await this.dataSource.query(
          `UPDATE asociacion SET 
            nombre = ?, CIF = ?, dirección = ?, cp = ?, teléfono = ?, email = ?, web = ? 
           WHERE idAsociacion = ?`,
          [
            data.legalName,
            data.cif,
            data.address,
            data.postalCode,
            data.generalPhone,
            data.generalEmail,
            data.website,
            existing[0].idAsociacion
          ]
        );
        return { success: true, ...data };
      } else {
        // INSERT inicial si la tabla está vacía
        const result = await this.dataSource.query(
          `INSERT INTO asociacion (nombre, CIF, dirección, cp, teléfono, email, web) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            data.legalName,
            data.cif,
            data.address,
            data.postalCode,
            data.generalPhone,
            data.generalEmail,
            data.website
          ]
        );
        return { id: result.insertId, ...data };
      }
    } catch (error) {
      this.handleError('Error al guardar datos de configuración', error, data);
    }
  }

  private validateDatos(data: any) {
    if (!data.legalName || !data.cif || !data.generalEmail) {
      throw new BadRequestException('Faltan campos obligatorios: Nombre, CIF o Email');
    }
  }

  private handleError(message: string, error: any, context?: any): never {
    this.logger.error(message, context ? JSON.stringify(context) : '', error?.stack);
    throw new InternalServerErrorException(message);
  }
}