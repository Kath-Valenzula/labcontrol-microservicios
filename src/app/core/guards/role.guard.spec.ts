import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  const mockAuth: any = { currentUserValue: { rol: 'ADMIN' } };

  beforeEach(() => {
    mockAuth.currentUserValue = { rol: 'ADMIN' };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: mockAuth }
      ]
    });
    guard = TestBed.inject(RoleGuard);
  });

  it('permite acceso cuando rol esta en la lista', () => {
    const result = guard.canActivate({ data: { roles: ['ADMIN'] } } as any, { url: '/' } as any);
    expect(result).toBeTrue();
  });

  it('redirige a login si no hay usuario', () => {
    mockAuth.currentUserValue = null;
    const tree = guard.canActivate({ data: { roles: ['ADMIN'] } } as any, { url: '/secure' } as any);
    expect((tree as any).toString()).toContain('/auth/login');
  });

  it('redirige a dashboard si rol no autorizado', () => {
    mockAuth.currentUserValue = { rol: 'PATIENT' };
    const tree = guard.canActivate({ data: { roles: ['ADMIN'] } } as any, { url: '/secure' } as any);
    expect((tree as any).toString()).toContain('/dashboard');
  });

  it('permite acceso si no se configuraron roles', () => {
    mockAuth.currentUserValue = { rol: 'ANY' };
    const result = guard.canActivate({ data: {} } as any, { url: '/' } as any);
    expect(result).toBeTrue();
  });
});
