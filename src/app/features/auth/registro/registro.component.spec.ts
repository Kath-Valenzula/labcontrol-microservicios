import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RegistroComponent } from './registro.component';
import { AuthService } from '../../../core/services/auth.service';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  const mockAuth = {
    register: jasmine.createSpy('register').and.returnValue(of({}))
  };

  beforeEach(async () => {
    mockAuth.register.calls.reset();
    mockAuth.register.and.returnValue(of({}));
    await TestBed.configureTestingModule({
      imports: [RegistroComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuth }]
    }).compileComponents();
    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function fillValidForm() {
    component.form.patchValue({
      nombre: 'Ana',
      apellido: 'Admin',
      correo: 'ana@example.com',
      telefono: '123',
      rol: 'ADMIN',
      passwords: { password: 'Abcdef1!', confirmPassword: 'Abcdef1!' }
    });
  }

  it('crea el componente', () => {
    expect(component).toBeTruthy();
  });

  it('submit valido llama register y setea exito', fakeAsync(() => {
    fillValidForm();
    spyOn((component as any).router, 'navigate').and.resolveTo(true);
    spyOn(window, 'setTimeout').and.callFake(((handler: any) => { if (typeof handler === 'function') { handler(); } return 0 as any; }) as any);
    component.submit();
    expect(mockAuth.register).toHaveBeenCalled();
    expect(component.successMsg).toBeTruthy();
  }));

  it('submit invalido no llama register', () => {
    component.submit();
    expect(mockAuth.register).not.toHaveBeenCalled();
  });

  it('helpers de password detectan mayus, minus, numero y simbolo', () => {
    component.form.get('passwords')?.patchValue({ password: 'Abc1!', confirmPassword: 'Abc1!' });
    expect(component.hasUpper()).toBeTrue();
    expect(component.hasLower()).toBeTrue();
    expect(component.hasNumber()).toBeTrue();
    expect(component.hasSymbol()).toBeTrue();
  });

  it('maneja error de register', () => {
    mockAuth.register.and.returnValue(throwError(() => ({ error: { message: 'fail' } })));
    fillValidForm();
    component.submit();
    expect(component.error).toBe('fail');
  });

  it('passwordMatchValidator marca mismatch', () => {
    component.form.get('passwords')?.patchValue({ password: 'Abcdef1!', confirmPassword: 'X' });
    expect(component.form.get('passwords')?.errors?.['mismatch']).toBeTrue();
  });
});
