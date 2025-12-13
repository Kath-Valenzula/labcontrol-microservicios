import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Laboratorio } from '../../models/laboratorio.model';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class LaboratoriosService {
  private base: string;
  constructor(private http: HttpClient, private config: ConfigService) {
    this.base = `${this.config.getLaboratoriosBaseUrl()}/laboratorios`;
  }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa('admin:admin123')
      })
    };
  }

  getAll(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.base, this.getAuthHeaders());
  }

  getById(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.base}/${id}`, this.getAuthHeaders());
  }

  create(payload: Partial<Laboratorio>): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(this.base, payload, this.getAuthHeaders());
  }

  update(id: number, payload: Partial<Laboratorio>): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(`${this.base}/${id}`, payload, this.getAuthHeaders());
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`, this.getAuthHeaders());
  }
}
