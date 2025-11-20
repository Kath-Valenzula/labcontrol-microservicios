import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Laboratorio } from '../../models/laboratorio.model';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class LaboratoriosService {
  private base: string;
  constructor(private http: HttpClient, private config: ConfigService) {
    this.base = `${this.config.getApiBaseUrl()}/laboratorios`;
  }

  getAll(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.base);
  }

  getById(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.base}/${id}`);
  }

  create(payload: Partial<Laboratorio>): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(this.base, payload);
  }

  update(id: number, payload: Partial<Laboratorio>): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
