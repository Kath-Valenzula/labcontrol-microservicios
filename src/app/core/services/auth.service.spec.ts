import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { Usuario } from '../../models/usuario.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let baseUrl: string;

  beforeEach(() => {
    localStorage.removeItem('labcontrol8_user');
    localStorage.removeItem('labcontrol8_auth');
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        ConfigService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    const cfg = TestBed.inject(ConfigService);
    baseUrl = cfg.getUsuariosBaseUrl();
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
    localStorage.removeItem('labcontrol8_user');
    localStorage.removeItem('labcontrol8_auth');
    TestBed.resetTestingModule();
  });

  it('login debe emitir usuario y guardarlo en localStorage', (done) => {
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    service.login({ correo: 'test@example.com', password: '12345678' }).subscribe(user => {
      expect(user.correo).toBe('test@example.com');
      expect(service.currentUserValue?.correo).toBe('test@example.com');
      const stored = localStorage.getItem('labcontrol8_user');
      expect(stored).toContain('test@example.com');
      const authHeader = localStorage.getItem('labcontrol8_auth');
      expect(authHeader).toBe('Basic ' + btoa('test@example.com:12345678'));
      done();
    });
    const req = httpMock.expectOne(`${baseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, correo: 'test@example.com', rol: 'ADMIN' });
  });

  it('logout debe limpiar usuario en memoria y storage', () => {
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    service.login({ correo: 'demo@example.com', password: '12345678' }).subscribe();
    httpMock.expectOne(`${baseUrl}/auth/login`).flush({ id: 2, correo: 'demo@example.com', rol: 'ADMIN' });
    service.logout();
    expect(service.currentUserValue).toBeNull();
    expect(localStorage.getItem('labcontrol8_user')).toBeNull();
    expect(localStorage.getItem('labcontrol8_auth')).toBeNull();
  });

  it('readStorageUser ignora JSON invalido y retorna null', () => {
    localStorage.setItem('labcontrol8_user', '{bad-json');
    service = TestBed.inject(AuthService);
    expect(service.currentUserValue).toBeNull();
  });

  it('isLoggedIn responde true solo con usuario actual', () => {
    service = TestBed.inject(AuthService);
    expect(service.isLoggedIn()).toBeFalse();
    service.login({ correo: 'demo@example.com', password: '12345678' }).subscribe();
    httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne(`${baseUrl}/auth/login`).flush({ id: 3, correo: 'demo@example.com', rol: 'USER' });
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('en server platform no toca localStorage', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        ConfigService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.setItem('labcontrol8_user', JSON.stringify({ correo: 'persist' }));
    localStorage.setItem('labcontrol8_auth', 'Basic persist');
    service.login({ correo: 'demo@example.com', password: '12345678' }).subscribe();
    httpMock.expectOne(`${baseUrl}/auth/login`).flush({ id: 4, correo: 'demo@example.com', rol: 'USER' });
    expect(localStorage.getItem('labcontrol8_user')).toContain('persist'); // saveUserToStorage no ejecuta
    expect(localStorage.getItem('labcontrol8_auth')).toBe('Basic persist');
  });

  it('register realiza POST a /usuarios', () => {
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    const payload: Partial<Usuario> & { password: string } = {
      nombre: 'Ana',
      apellido: 'Admin',
      correo: 'ana@example.com',
      password: '12345678'
    };
    service.register(payload).subscribe();
    httpMock = TestBed.inject(HttpTestingController);
    const req = httpMock.expectOne(`${baseUrl}/usuarios`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...payload, id: 1, rol: 'ADMIN', fechaRegistro: '2024-01-01' });
  });

  it('forgotPassword realiza POST a /usuarios/forgot', () => {
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    service.forgotPassword('reset@example.com').subscribe();
    const req = httpMock.expectOne(`${baseUrl}/usuarios/forgot`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.correo).toBe('reset@example.com');
    req.flush({ message: 'ok' });
  });

  it('currentUser$ emite cambios al hacer login y logout', (done) => {
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    const emissions: Array<string | null> = [];
    const sub = service.currentUser$.subscribe(u => emissions.push(u?.correo || null));
    service.login({ correo: 'flow@example.com', password: '12345678' }).subscribe(() => {
      service.logout();
      expect(emissions).toContain('flow@example.com');
      expect(emissions[emissions.length - 1]).toBeNull();
      sub.unsubscribe();
      done();
    });
    httpMock.expectOne(`${baseUrl}/auth/login`).flush({ id: 5, correo: 'flow@example.com', rol: 'USER' });
  });
});
