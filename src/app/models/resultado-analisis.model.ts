// Modelo: ResultadoAnalisis
// Representa un resultado de examen/analisis
export interface ResultadoAnalisis {
  id: number;
  pacienteId: number;
  laboratorioId: number;
  tipoExamen: string;
  fecha: string; // ISO date string
  resultado: string;
  observaciones?: string;
}

