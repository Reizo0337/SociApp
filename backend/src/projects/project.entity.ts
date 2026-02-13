import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuarios } from '../users/user.entity';

@Entity('proyectos')
export class Proyecto {
    @PrimaryGeneratedColumn()
    idProyecto: number;

    @Column({ length: 255 })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ length: 50 })
    estado: string;

    @ManyToOne(() => Usuarios)
    @JoinColumn({ name: 'Responsable' })
    responsable: Usuarios;

    @Column('decimal')
    presupuesto: number;

    @Column({ length: 150, nullable: true })
    fuenteFinanciacion: string;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date', nullable: true })
    endDate: Date;

    @Column({ type: 'text', nullable: true })
    notas: string;

    @Column('simple-array', { nullable: true })
    subproyectos: string[];

    @Column('simple-array', { nullable: true })
    actividades: string[];
}
