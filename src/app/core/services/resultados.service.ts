import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultadoAnalisis } from '../../models/resultado-analisis.model';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class ResultadosService {
  private base: string;
  constructor(private http: HttpClient, private config: ConfigService) {
    this.base = `${this.config.getApiBaseUrl()}/resultados`;
  }

  getAll(): Observable<ResultadoAnalisis[]> {
    return this.http.get<ResultadoAnalisis[]>(this.base);
  }

  getById(id: number): Observable<ResultadoAnalisis> {
    return this.http.get<ResultadoAnalisis>(`${this.base}/${id}`);
  }

  getByPacienteId(pacienteId: number): Observable<ResultadoAnalisis[]> {
    const params = new HttpParams().set('pacienteId', String(pacienteId));
    return this.http.get<ResultadoAnalisis[]>(this.base, { params });
  }

  create(payload: Partial<ResultadoAnalisis>): Observable<ResultadoAnalisis> {
    return this.http.post<ResultadoAnalisis>(this.base, payload);
  }

  update(id: number, payload: Partial<ResultadoAnalisis>): Observable<ResultadoAnalisis> {
    return this.http.put<ResultadoAnalisis>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
