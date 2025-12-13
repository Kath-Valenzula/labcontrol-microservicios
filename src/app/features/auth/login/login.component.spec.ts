import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const mockAuth = {
    login: jasmine.createSpy('login').and.returnValue(of({ correo: 'demo@example.com' }))
  };

  beforeEach(async () => {
    mockAuth.login.calls.reset();
    mockAuth.login.and.returnValue(of({ correo: 'demo@example.com' }));
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuth },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: { returnUrl: '/dashboard' } } }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('submit valido llama login y completa flujo', fakeAsync(() => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.resolveTo(true);
    component.form.setValue({ correo: 'demo@example.com', password: '12345678' });
    component.submit();
    expect(mockAuth.login).toHaveBeenCalled();
    tick();
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  }));

  it('submit invalido marca touched y no llama login', () => {
    component.form.patchValue({ correo: '', password: '' });
    component.submit();
    expect(mockAuth.login).not.toHaveBeenCalled();
  });

  it('maneja error de login y setea mensaje', () => {
    mockAuth.login.and.returnValue(throwError(() => ({ error: { message: 'bad' } })));
    component.form.setValue({ correo: 'demo@example.com', password: '12345678' });
    component.submit();
    expect(component.error).toBe('bad');
    expect(component.loading).toBeFalse();
  });
});
