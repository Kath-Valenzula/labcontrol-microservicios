import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Laboratorio } from '../../models/laboratorio.model';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class LaboratoriosService {
  private base: string;
  constructor(private http: HttpClient, private config: ConfigService) {
    this.base = `${this.config.getLaboratoriosBaseUrl()}/laboratorios`;
  }

  private normalizeLab(lab: any): Laboratorio {
    if (!lab || typeof lab !== 'object') return lab as Laboratorio;
    const id = lab.id ?? lab.idLab ?? null;
    return { ...lab, id };
  }

  getAll(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.base).pipe(
      map(labs => (Array.isArray(labs) ? labs.map(lab => this.normalizeLab(lab)) : []))
    );
  }

  getById(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.base}/${id}`).pipe(
      map(lab => this.normalizeLab(lab))
    );
  }

  create(payload: Partial<Laboratorio>): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(this.base, payload).pipe(
      map(lab => this.normalizeLab(lab))
    );
  }

  update(id: number, payload: Partial<Laboratorio>): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(`${this.base}/${id}`, payload).pipe(
      map(lab => this.normalizeLab(lab))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
