import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RecuperarPasswordComponent } from './recuperar-password.component';
import { AuthService } from '../../../core/services/auth.service';

describe('RecuperarPasswordComponent', () => {
  let component: RecuperarPasswordComponent;
  let fixture: ComponentFixture<RecuperarPasswordComponent>;
  const mockAuth = {
    forgotPassword: jasmine.createSpy('forgotPassword').and.returnValue(of({ message: 'ok' }))
  };

  beforeEach(async () => {
    mockAuth.forgotPassword.calls.reset();
    mockAuth.forgotPassword.and.returnValue(of({ message: 'ok' }));
    await TestBed.configureTestingModule({
      imports: [RecuperarPasswordComponent],
      providers: [{ provide: AuthService, useValue: mockAuth }]
    }).compileComponents();
    fixture = TestBed.createComponent(RecuperarPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('crea el componente', () => {
    expect(component).toBeTruthy();
  });

  it('submit valido llama forgotPassword y muestra mensaje', fakeAsync(() => {
    component.form.patchValue({ correo: 'demo@example.com' });
    component.submit();
    tick();
    expect(mockAuth.forgotPassword).toHaveBeenCalledWith('demo@example.com');
    expect(component.message).toBe('ok');
  }));

  it('submit invalido no llama forgotPassword', () => {
    component.form.patchValue({ correo: '' });
    component.submit();
    expect(mockAuth.forgotPassword).not.toHaveBeenCalled();
  });

  it('maneja error de forgotPassword', () => {
    mockAuth.forgotPassword.and.returnValue(throwError(() => ({ error: { message: 'x' } })));
    component.form.patchValue({ correo: 'demo@example.com' });
    component.submit();
    expect(component.error).toBe('x');
  });

  it('reset de mensajes al reintentar', () => {
    component.message = 'ok';
    component.error = 'err';
    component.form.patchValue({ correo: 'demo@example.com' });
    component.submit();
    expect(component.error).toBeNull();
  });
});
