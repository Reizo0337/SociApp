import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Usuarios } from '../users/user.entity';
import { Proyecto } from '../projects/project.entity';

@Entity('actividades')
export class Activity {
    @PrimaryGeneratedColumn({ name: 'Id' })
    id: number;

    @Column({ name: 'Nombre' })
    name: string;

    @Column({ name: 'Lugar' })
    place: string;

    @Column({ name: 'HoraInicio', type: 'time' })
    horaInicio: string;

    @Column({ name: 'HoraFin', type: 'time' })
    horaFin: string;

    @Column({ name: 'DiaSemana' })
    diaSemana: string;

    @Column({ name: 'Icon', nullable: true })
    icon: string;

    @Column({ name: 'idMonitor', nullable: true })
    idMonitor: number;

    @ManyToOne(() => Usuarios)
    @JoinColumn({ name: 'idMonitor' })
    monitor: Usuarios;


}
