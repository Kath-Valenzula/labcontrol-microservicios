// Modelo: Usuario
// Representa un usuario del sistema LabControl 8
export type UserRole = 'ADMIN' | 'PATIENT' | 'MEDICO';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string; // opcional
  fechaRegistro: string; // ISO date string
  rol: UserRole;
}
