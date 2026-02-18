import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Donativo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cantidad: number;

  @Column()
  fecha: Date;

  @Column({ nullable: true })
  descripcion?: string;
}
