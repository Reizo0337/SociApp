import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class Usuarios {
  @PrimaryGeneratedColumn()
  IdUsuario: number;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column()
  password: string;

  @Column()
  dni: string;

  @Column()
  direccion: string;

  @Column({ name: 'CP' })
  CP: string;

  @Column()
  provincia: string;

  @Column()
  poblacion: string;

  @Column()
  pais: string;

  @Column()
  email: string;

  @Column()
  telefono: string;

  @Column({ type: 'date' })
  fechaalta: Date;

  @Column({ type: 'date', nullable: true })
  fechabaja: Date;

  @Column()
  formadepago: string;

  @Column({ type: 'decimal' })
  cuota: number;

  @Column()
  categoria: string;

  @Column({
    type: 'enum',
    enum: ['Socio', 'NoSocio'],
    default: 'NoSocio'
  })
  socio: 'Socio' | 'NoSocio';
}
