import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultadoAnalisis } from '../../models/resultado-analisis.model';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class ResultadosService {
  private base: string;
  constructor(private http: HttpClient, private config: ConfigService) {
    this.base = `${this.config.getResultadosBaseUrl()}/resultados`;
  }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa('admin:admin123')
      })
    };
  }

  getAll(): Observable<ResultadoAnalisis[]> {
    return this.http.get<ResultadoAnalisis[]>(this.base, this.getAuthHeaders());
  }

  getById(id: number): Observable<ResultadoAnalisis> {
    return this.http.get<ResultadoAnalisis>(`${this.base}/${id}`, this.getAuthHeaders());
  }

  getByPacienteId(pacienteId: number): Observable<ResultadoAnalisis[]> {
    const params = new HttpParams().set('pacienteId', String(pacienteId));
    return this.http.get<ResultadoAnalisis[]>(this.base, { params, ...this.getAuthHeaders() });
  }

  create(payload: Partial<ResultadoAnalisis>): Observable<ResultadoAnalisis> {
    return this.http.post<ResultadoAnalisis>(this.base, payload, this.getAuthHeaders());
  }

  update(id: number, payload: Partial<ResultadoAnalisis>): Observable<ResultadoAnalisis> {
    return this.http.put<ResultadoAnalisis>(`${this.base}/${id}`, payload, this.getAuthHeaders());
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`, this.getAuthHeaders());
  }
}
