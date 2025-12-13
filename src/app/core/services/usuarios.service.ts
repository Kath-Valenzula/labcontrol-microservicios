import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private base: string;
  constructor(private http: HttpClient, private config: ConfigService) {
    this.base = `${this.config.getUsuariosBaseUrl()}/usuarios`;
  }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa('admin:admin123')
      })
    };
  }

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.base, this.getAuthHeaders());
  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.base}/${id}`, this.getAuthHeaders());
  }

  create(payload: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(this.base, payload, this.getAuthHeaders());
  }

  update(id: number, payload: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.base}/${id}`, payload, this.getAuthHeaders());
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`, this.getAuthHeaders());
  }
}
