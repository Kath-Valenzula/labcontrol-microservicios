import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser$: Observable<Usuario | null>;

  private basicAuthHeader: string | null = null;
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any, private config: ConfigService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(this.readStorageUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.basicAuthHeader = this.readStorageAuth();
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

  setCurrentUser(user: Usuario | null) {
    this.currentUserSubject.next(user);
    this.saveUserToStorage(user);
  }

  private readStorageAuth(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('labcontrol8_auth');
  }

  private saveAuthToStorage(authHeader: string | null) {
    if (!this.isBrowser) return;
    if (authHeader) {
      localStorage.setItem('labcontrol8_auth', authHeader);
    } else {
      localStorage.removeItem('labcontrol8_auth');
    }
  }

  private buildBasicAuthHeader(credentials: { correo: string; password: string }): string {
    const token = btoa(`${credentials.correo}:${credentials.password}`);
    return `Basic ${token}`;
  }

  login(credentials: { correo: string; password: string }): Observable<Usuario> {
    const url = `${this.config.getUsuariosBaseUrl()}/auth/login`;
    return this.http.post<Usuario>(url, credentials).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.saveUserToStorage(user);
        const authHeader = this.buildBasicAuthHeader(credentials);
        this.basicAuthHeader = authHeader;
        this.saveAuthToStorage(authHeader);
      })
    );
  }

  register(payload: Partial<Usuario> & { password: string }): Observable<Usuario> {
    const url = `${this.config.getUsuariosBaseUrl()}/usuarios`;
    return this.http.post<Usuario>(url, payload).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.saveUserToStorage(user);
        if (payload.password) {
          const authHeader = this.buildBasicAuthHeader({ correo: payload.correo || '', password: payload.password });
          this.basicAuthHeader = authHeader;
          this.saveAuthToStorage(authHeader);
        }
      })
    );
  }

  forgotPassword(correo: string): Observable<{ message: string }> {
    const url = `${this.config.getUsuariosBaseUrl()}/usuarios/forgot`;
    return this.http.post<{ message: string }>(url, { correo });
  }

  logout() {
    this.currentUserSubject.next(null);
    this.saveUserToStorage(null);
    this.basicAuthHeader = null;
    this.saveAuthToStorage(null);
  }

  get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  getBasicAuthHeader(): string | null {
    return this.basicAuthHeader;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}
