import { Injectable, Logger, BadRequestException } from '@nestjs/common';

// Interfaz Proyecto basada en tu schema
export interface Proyecto {
  id: number;
  nombre: string;
  descripcion?: string;
  estado: 'Activo' | 'Pendiente' | 'Finalizado';
  responsable: string;
  departamento?: string;
  presupuesto: number;
  fuenteFinanciacion?: 'Fondos propios' | 'Subvención' | 'Donaciones' | 'Mixto';
  startDate: string; // ISO string
  endDate?: string;  // ISO string opcional
  notas?: string;
  subproyectos: string[];
  actividades: string[];
}

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  private proyectos: Proyecto[] = [
    {
      id: 1,
      nombre: 'Cultura',
      descripcion: 'Proyecto cultural de ejemplo',
      estado: 'Activo',
      responsable: 'Ana Pérez',
      departamento: 'Cultura',
      presupuesto: 5000,
      fuenteFinanciacion: 'Fondos propios',
      startDate: '2026-02-01',
      endDate: '2026-06-01',
      notas: 'Ninguna',
      subproyectos: ['Promoción de salud'],
      actividades: ['Yoga', 'Dibujo'],
    },
    {
      id: 2,
      nombre: 'Concursos',
      descripcion: 'Concursos educativos',
      estado: 'Pendiente',
      responsable: 'Juan Ruiz',
      departamento: 'Educación',
      presupuesto: 2000,
      fuenteFinanciacion: 'Subvención',
      startDate: '2026-03-01',
      subproyectos: [],
      actividades: [],
    }
  ];

  // Obtener todos los proyectos
  getProjects() {
    return this.proyectos;
  }

  // Crear un nuevo proyecto
  createProject(proyecto: Proyecto) {
    if (!proyecto.nombre || !proyecto.responsable || !proyecto.estado || !proyecto.presupuesto || !proyecto.startDate) {
      throw new BadRequestException('Faltan campos obligatorios');
    }

    proyecto.id = this.proyectos.length ? Math.max(...this.proyectos.map(p => p.id)) + 1 : 1;
    proyecto.subproyectos = proyecto.subproyectos || [];
    proyecto.actividades = proyecto.actividades || [];
    this.proyectos.push(proyecto);
    return proyecto;
  }

  // Actualizar un proyecto por ID
  updateProject(id: number, data: Partial<Proyecto>) {
    const index = this.proyectos.findIndex(p => p.id === id);
    if (index === -1) throw new BadRequestException('Proyecto no encontrado');

    this.proyectos[index] = { ...this.proyectos[index], ...data };
    return this.proyectos[index];
  }

  // Eliminar un proyecto por ID
  deleteProject(id: number) {
    const index = this.proyectos.findIndex(p => p.id === id);
    if (index === -1) throw new BadRequestException('Proyecto no encontrado');

    const deleted = this.proyectos.splice(index, 1)[0];
    return { success: true, proyecto: deleted };
  }
}