// Modelo: Laboratorio
// Representa un laboratorio clínico
export interface Laboratorio {
  id?: number;
  nombre: string;
  ubicacion: string;
  capacidad?: number;
  encargadoId?: number;
}
