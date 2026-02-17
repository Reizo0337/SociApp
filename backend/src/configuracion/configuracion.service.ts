import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ConfiguracionService {
  private readonly logger = new Logger(ConfiguracionService.name);

  constructor(private readonly dataSource: DataSource) { }

  // --- SECCIÓN: DATOS ASOCIACIÓN ---

  async getDatosAsociacion() {
    try {
      const data = await this.dataSource.query(`SELECT * FROM asociacion LIMIT 1`);
      if (!data.length) return null;

      const a = data[0];
      return {
        Nombre: a.Nombre,
        CIF: a.CIF,
        Direccion: a.Direccion,
        CP: a.CP,
        Telefono: a.Telefono,
        Email: a.Email,
        Web: a.Web,
        nrRegistro: a.nrRegistro,
        Logo: a.Logo
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
        await this.dataSource.query(
          `UPDATE asociacion SET 
            Nombre = ?, CIF = ?, Direccion = ?, CP = ?, Telefono = ?, Email = ?, Web = ? 
          WHERE idAsociacion = ?`,
          [data.Nombre, data.CIF, data.Direccion, data.CP, data.Telefono, data.Email, data.Web, existing[0].idAsociacion]
        );
        return { ...data };
      } else {
        const result = await this.dataSource.query(
          `INSERT INTO asociacion (Nombre, CIF, Direccion, CP, Telefono, Email, Web) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [data.Nombre, data.CIF, data.Direccion, data.CP, data.Telefono, data.Email, data.Web]
        );
        return { idAsociacion: result.insertId, ...data };
      }
    } catch (error) {
      this.handleError('Error al guardar datos', error, data);
    }
  }

  // --- SECCIÓN: JUNTA DIRECTIVA ---

  async getUsuariosParaJunta() {
    return this.dataSource.query(`SELECT idUsuario, Nombre, Apellidos FROM usuarios`);
  }

  async getJunta() {
    return this.dataSource.query(`
      SELECT j.id, j.idUsuario, j.Notas as cargo, u.Nombre, u.Apellidos 
      FROM juntadirectiva j
      JOIN usuarios u ON j.idUsuario = u.idUsuario
    `);
  }

  async addJunta(data: any) {
    try {
      const resAsoc = await this.dataSource.query(`SELECT idAsociacion FROM asociacion LIMIT 1`);
      const idAsoc = resAsoc.length > 0 ? resAsoc[0].idAsociacion : 1;

      const result = await this.dataSource.query(
        `INSERT INTO juntadirectiva (idUsuario, idAsociacion, Notas, FechaEntrada) VALUES (?, ?, ?, NOW())`,
        [data.idUsuario, idAsoc, data.cargo]
      );

      return { id: result.insertId, ...data };
    } catch (error) {
      this.handleError('Error al insertar en la junta directiva', error, data);
    }
  }

  async updateJunta(id: number, data: any) {
    try {
      await this.dataSource.query(
        `UPDATE juntadirectiva SET idUsuario = ?, Notas = ? WHERE id = ?`,
        [data.idUsuario, data.cargo, id]
      );
      return { id, ...data };
    } catch (error) {
      this.handleError('Error al actualizar miembro de la junta', error);
    }
  }

  async deleteJunta(id: number) {
    return this.dataSource.query(`DELETE FROM juntadirectiva WHERE id = ?`, [id]);
  }

  // --- SECCIÓN: RELACIONES INSTITUCIONALES ---

  async getRelaciones() {
    return this.dataSource.query(`SELECT * FROM relacionesinstitucionales`);
  }

  async addRelacion(data: any) {
    try {
      const asoc = await this.dataSource.query(`SELECT idAsociacion FROM asociacion LIMIT 1`);
      const idAsoc = asoc.length > 0 ? asoc[0].idAsociacion : 1;

      const result = await this.dataSource.query(`
        INSERT INTO relacionesinstitucionales 
        (IdAsociacion, Nombre, Direccion, CP, Poblacion, Telefono, Email, Web, Notas)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          idAsoc, data.Nombre, data.Direccion || '', data.CP || null,
          data.Poblacion || '', data.Telefono || '', data.Email || '',
          data.Web || '', data.Notas || ''
        ]
      );

      return { IdInstitucion: result.insertId, ...data };
    } catch (error) {
      this.handleError('Error al guardar la relación institucional', error, data);
    }
  }

  async updateRelacion(id: number, data: any) {
    try {
      await this.dataSource.query(`
        UPDATE relacionesinstitucionales 
        SET Nombre = ?, Direccion = ?, CP = ?, Poblacion = ?, Telefono = ?, Email = ?, Web = ?, Notas = ?
        WHERE IdInstitucion = ?`,
        [
          data.Nombre, data.Direccion || '', data.CP || null,
          data.Poblacion || '', data.Telefono || '', data.Email || '',
          data.Web || '', data.Notas || '', id
        ]
      );
      return { IdInstitucion: id, ...data };
    } catch (error) {
      this.handleError('Error al actualizar relación institucional', error);
    }
  }

  async deleteRelacion(id: number) {
    return this.dataSource.query(`DELETE FROM relacionesinstitucionales WHERE IdInstitucion = ?`, [id]);
  }

  // --- HELPERS ---

  private validateDatos(data: any) {
    if (!data.Nombre || !data.CIF || !data.Email) {
      throw new BadRequestException('Faltan campos obligatorios: Nombre, CIF o Email');
    }
  }

  private handleError(message: string, error: any, context?: any): never {
    this.logger.error(`${message}: ${error.message}`, error.stack, context ? JSON.stringify(context) : '');
    throw new InternalServerErrorException(message);
  }
}