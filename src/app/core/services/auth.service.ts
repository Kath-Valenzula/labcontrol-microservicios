import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
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
    // DEMO: Login simulado - busca usuario por correo y permite cualquier contraseña
    const demoUser: Usuario = {
      id: 1,
      nombre: 'Usuario',
      apellido: 'Demo',
      correo: credentials.correo,
      telefono: '999888777',
      fechaRegistro: new Date().toISOString().split('T')[0],
      rol: 'ADMIN'
    };
    this.currentUserSubject.next(demoUser);
    this.saveUserToStorage(demoUser);
    return of(demoUser);
  }

  register(payload: Partial<Usuario> & { password: string }): Observable<Usuario> {
    const url = `${this.config.getApiBaseUrl()}/usuarios`;
    return this.http.post<Usuario>(url, payload);
  }

  forgotPassword(correo: string): Observable<{ message: string }> {
    // Simulación: el backend real enviará correo. Aquí retornamos observable de éxito.
    const url = `${this.config.getApiBaseUrl()}/usuarios/forgot`;
    // Si no hay backend listo, podemos simular con `of(...)`.
    return this.http.post<{ message: string }>(url, { correo });
    // return of({ message: 'Se ha enviado un correo con instrucciones.' });
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
