import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }
    // ⚠️ SEGURIDAD: Verificar que el usuario tenga la categoría requerida
    // El usuario tiene 'categoria' (monitor, admin, administrador, usuario) no 'role'
    const userCategory = user.categoria?.toLowerCase() || '';
    
    // Normalizar diferentes variantes de administrador
    const normalizedCategory = userCategory === 'administrador' ? 'admin' : userCategory;
    
    // Verificar si el usuario tiene alguno de los roles requeridos
    const hasAccess = requiredRoles.some((role) => {
      const normalizedRole = role.toLowerCase();
      return normalizedCategory === normalizedRole || 
             (normalizedRole === 'admin' && normalizedCategory === 'administrador') ||
             (normalizedCategory === 'admin' && normalizedRole === 'administrador');
    });
    
    return hasAccess;
  }
}
