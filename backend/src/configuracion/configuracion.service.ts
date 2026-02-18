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
  validateDatos(data: any) {
    if (!data.Nombre || !data.CIF) {
      throw new BadRequestException('El nombre y el CIF son obligatorios');
    }
  }

  // --- SECCIÓN: JUNTA DIRECTIVA ---

  async getUsuariosParaJunta() {
    return this.dataSource.query(`SELECT idUsuario, Nombre, Apellidos FROM usuarios WHERE idUsuario NOT IN  (
      SELECT idUsuario FROM juntadirectiva)`);
  }
  async getCargos() {
    try {
      // Esta query extrae los valores definidos en el ENUM de la columna 'Categoria'
      const rows: any[] = await this.dataSource.query(`
        SELECT COLUMN_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'usuarios' 
          AND COLUMN_NAME = 'Categoria'
          AND TABLE_SCHEMA = DATABASE()
      `);

      if (!rows.length) return [];

      const enumString: string = rows[0].COLUMN_TYPE;
      const values = enumString
        .replace(/^enum\(|\)$/gi, '')
        .split(',')
        .map(v => v.replace(/'/g, ''));

      return values.map(v => ({ value: v, label: v }));
    } catch (error) {
      this.handleError('Error al obtener los cargos', error);
    }
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
      const idAsoc = await this.getIdAsociacion();
      const result = await this.dataSource.query(`
        INSERT INTO relacionesinstitucionales 
        ( IdAsociacion, Nombre, Direccion, CP, Poblacion, Provincia, Pais, Telefono, Email, Web, Notas)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          idAsoc, data.Nombre, data.Direccion || '', data.CP || null,
          data.Poblacion || '', data.Provincia || '', data.Pais || '',
          data.Telefono || '', data.Email || '', data.Web || '', data.Notas || ''
        ]
      );
      return { IdInstitucion: result.insertId, ...data };
    } catch (error) {
      this.handleError('Error al guardar relación', error, data);
    }
  }

  async updateRelacion(id: number, data: any) {
    try {
      await this.dataSource.query(`
        UPDATE relacionesinstitucionales 
        SET Nombre=?, Direccion=?, CP=?, Poblacion=?, Provincia=?, Pais=?, Telefono=?, Email=?, Web=?, Notas=?
        WHERE IdInstitucion = ?`,
        [
          data.Nombre, data.Direccion || '', data.CP || null, data.Poblacion || '',
          data.Provincia || '', data.Pais || '', data.Telefono || '',
          data.Email || '', data.Web || '', data.Notas || '', id
        ]
      );
      return { IdInstitucion: id, ...data };
    } catch (error) {
      this.handleError('Error al actualizar relación', error);
    }
  }
  async deleteRelacion(id: number) {
    return this.dataSource.query(`DELETE FROM relacionesinstitucionales WHERE IdInstitucion = ?`, [id]);
  }

  // Helper para obtener el ID de la asociación (usado en los inserts)
  private async getIdAsociacion(): Promise<number> {
    const res = await this.dataSource.query(`SELECT idAsociacion FROM asociacion LIMIT 1`);
    return res.length > 0 ? res[0].idAsociacion : 1;
  }

  // --- SECCIÓN: BANCOS (Tabla: cuentabancaria) ---
  async getBancos() {
    return this.dataSource.query(`SELECT * FROM cuentabancaria`);
  }

  async addBancos(data: any) {
    try {
      const idAsoc = await this.getIdAsociacion();
      const result = await this.dataSource.query(`
        INSERT INTO cuentabancaria 
        (idAsociacion, Nombre, Direccion, CodigoPostal, Poblacion, Pais, Telefono, CodigoNegocio, Referencia_SEPA, IBAN, Swift)
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          idAsoc, data.Nombre, data.Direccion || '', data.CodigoPostal || null,
          data.Poblacion || '', data.Pais || '', data.Telefono || '',
          data.CodigoNegocio || '', data.Referencia_SEPA || '', data.IBAN, data.Swift || ''
        ]
      );
      return { ID: result.insertId, ...data };
    } catch (error) {
      this.handleError('Error al guardar banco', error, data);
    }
  }

  async updateBancos(id: number, data: any) {
    try {
      await this.dataSource.query(`
        UPDATE cuentabancaria 
        SET Nombre=?, Direccion=?, CodigoPostal=?, Poblacion=?, Pais=?, Telefono=?, CodigoNegocio=?, Referencia_SEPA=?, IBAN=?, Swift=?
        WHERE ID = ?`,
        [
          data.Nombre, data.Direccion || '', data.CodigoPostal || null, data.Poblacion || '',
          data.Pais || '', data.Telefono || '', data.CodigoNegocio || '',
          data.Referencia_SEPA || '', data.IBAN, data.Swift || '', id
        ]
      );
      return { ID: id, ...data };
    } catch (error) {
      this.handleError('Error al actualizar banco', error);
    }
  }
  // Añade estos métodos a tu ConfiguracionService
  async deleteBancos(id: number) {
    return this.dataSource.query(`DELETE FROM cuentabancaria WHERE ID = ?`, [id]);
  }

  // --- SECCIÓN: DONATIVOS Y HERENCIAS (Tabla: donativosherencias) ---
  async getDonativos() {
    return this.dataSource.query(`SELECT * FROM donativosherencias`);
  }
  async deleteDonativos(id: number) {
    return this.dataSource.query(`DELETE FROM donativosherencias WHERE idDonativo = ?`, [id]);
  }

  async addDonativos(data: any) {
    try {
      const idAsoc = await this.getIdAsociacion();
      const result = await this.dataSource.query(`
        INSERT INTO donativosherencias 
        (idAsociacion, Nombre, Direccion, Poblacion, CP, Pais, Telefono, NIF, Email, Notas, Tipo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          idAsoc, data.Nombre, data.Direccion || '', data.Poblacion || '',
          data.CP || null, data.Pais || '', data.Telefono || '',
          data.NIF || '', data.Email || '', data.Notas || '', data.Tipo
        ]
      );
      return { idDonativo: result.insertId, ...data };
    } catch (error) {
      this.handleError('Error al guardar donativo', error, data);
    }
  }

  async updateDonativos(id: number, data: any) {
    try {
      await this.dataSource.query(`
        UPDATE donativosherencias 
        SET Nombre=?, Direccion=?, Poblacion=?, CP=?, Pais=?, Telefono=?, NIF=?, Email=?, Notas=?, Tipo=?
        WHERE idDonativo = ?`,
        [
          data.Nombre, data.Direccion || '', data.Poblacion || '', data.CP || null,
          data.Pais || '', data.Telefono || '', data.NIF || '',
          data.Email || '', data.Notas || '', data.Tipo, id
        ]
      );
      return { idDonativo: id, ...data };
    } catch (error) {
      this.handleError('Error al actualizar donativo', error);
    }
  }

  // --- MANEJO DE ERRORES ---
  private handleError(message: string, error: any, data?: any): never {
    const errorMessage = error?.message || 'Error desconocido';
    this.logger.error(`${message}: ${errorMessage}`);

    // Si no es un error de validación (BadRequest), lanzamos 500
    throw new InternalServerErrorException({
      message: message,
      detail: errorMessage,
      data: data // Esto ayuda a ver qué falló en la consola de red
    });
  }
}