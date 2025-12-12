import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private base: string;
  constructor(private http: HttpClient, private config: ConfigService) {
    this.base = `${this.config.getUsuariosBaseUrl()}/usuarios`;
  }

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.base);
  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.base}/${id}`);
  }

  create(payload: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(this.base, payload);
  }

  update(id: number, payload: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
