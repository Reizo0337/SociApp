import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Banco {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion?: string;
}
