// Modelo: Laboratorio
// Representa un laboratorio clinico
export interface Laboratorio {
  id?: number;
  nombre: string;
  ubicacion: string;
  capacidad?: number;
  encargadoId?: number;
}

