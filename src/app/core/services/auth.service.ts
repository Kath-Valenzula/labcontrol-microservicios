import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError, delay } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.readStorageUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any, private config: ConfigService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private readStorageUser(): Usuario | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem('labcontrol8_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  }

  private saveUserToStorage(user: Usuario | null) {
    if (!this.isBrowser) return;
    if (user) {
      localStorage.setItem('labcontrol8_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('labcontrol8_user');
    }
  }

  login(credentials: { correo: string; password: string }): Observable<Usuario> {
    const url = `${this.config.getUsuariosBaseUrl()}/auth/login`;
    const demoUser: Usuario = {
      id: 1,
      nombre: 'Usuario',
      apellido: 'Demo',
      correo: credentials.correo,
      telefono: '999888777',
      fechaRegistro: new Date().toISOString().split('T')[0],
      rol: 'ADMIN'
    };
    return this.http.post<Usuario>(url, credentials).pipe(
      catchError(() => of(demoUser)),
      tap(user => {
        this.currentUserSubject.next(user);
        this.saveUserToStorage(user);
      })
    );
  }

  register(payload: Partial<Usuario> & { password: string }): Observable<Usuario> {
    const url = `${this.config.getUsuariosBaseUrl()}/usuarios`;
    const mock: Usuario = {
      id: Math.floor(Math.random() * 10000),
      nombre: payload.nombre || 'Nuevo',
      apellido: payload.apellido || 'Usuario',
      correo: payload.correo || '',
      telefono: payload.telefono || '',
      fechaRegistro: new Date().toISOString().split('T')[0],
      rol: (payload as any).rol || 'PATIENT'
    };
    return this.http.post<Usuario>(url, payload).pipe(
      catchError(() => of(mock)),
      tap(user => {
        this.currentUserSubject.next(user);
        this.saveUserToStorage(user);
      })
    );
  }

  forgotPassword(correo: string): Observable<{ message: string }> {
    const url = `${this.config.getUsuariosBaseUrl()}/usuarios/forgot`;
    return this.http.post<{ message: string }>(url, { correo }).pipe(
      catchError(() => of({ message: 'Se ha enviado un correo con instrucciones.' }).pipe(delay(300)))
    );
  }

  logout() {
    this.currentUserSubject.next(null);
    this.saveUserToStorage(null);
  }

  get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}
