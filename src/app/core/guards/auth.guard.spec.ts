import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  const mockAuth: any = { isLoggedIn: () => false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: mockAuth }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('permite acceso si esta logueado', () => {
    mockAuth.isLoggedIn = () => true;
    const result = guard.canActivate({} as any, { url: '/home' } as any);
    expect(result).toBeTrue();
  });

  it('redirige a login si no esta logueado', () => {
    mockAuth.isLoggedIn = () => false;
    const router = TestBed.inject(Router);
    const tree = guard.canActivate({} as any, { url: '/protected' } as any);
    expect((tree as any).toString()).toContain('/auth/login');
  });
});
