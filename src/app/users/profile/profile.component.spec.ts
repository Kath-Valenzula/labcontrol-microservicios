import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { UsuariosService } from '../../core/services/usuarios.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  const user: Usuario = {
    id: 1,
    nombre: 'Ana',
    apellido: 'Admin',
    correo: 'ana@example.com',
    telefono: '123',
    fechaRegistro: '2024-01-01',
    rol: 'ADMIN'
  };
  const mockAuth: any = {};
  const mockUsuarios: any = {};

  beforeEach(async () => {
    mockAuth.currentUserSubject = new BehaviorSubject<Usuario | null>(user);
    mockAuth.currentUser$ = mockAuth.currentUserSubject.asObservable();
    mockAuth.setCurrentUser = jasmine.createSpy('setCurrentUser').and.callFake((updated: Usuario | null) => {
      mockAuth.currentUserSubject.next(updated);
    });
    if (Object.getOwnPropertyDescriptor(mockAuth, 'currentUserValue')) {
      delete (mockAuth as any).currentUserValue;
    }
    Object.defineProperty(mockAuth, 'currentUserValue', {
      configurable: true,
      get: () => mockAuth.currentUserSubject.value
    });
    mockUsuarios.update = jasmine.createSpy('update').and.returnValue(of({ ...user }));

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: UsuariosService, useValue: mockUsuarios }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe precargar el formulario con el usuario actual', () => {
    expect(component.form.value.nombre).toBe('Ana');
    expect(component.form.value.apellido).toBe('Admin');
    expect(component.form.value.correo).toBe('ana@example.com');
    expect(component.form.value.telefono).toBe('123');
  });

  it('cancel restaura los datos originales y limpia mensajes', () => {
    component.form.patchValue({ nombre: 'Otro' });
    component.success = 'ok';
    component.error = 'err';
    component.cancel();
    expect(component.form.value.nombre).toBe('Ana');
    expect(component.success).toBeNull();
    expect(component.error).toBeNull();
  });

  it('save marca touched y no continua si el formulario es invalido', () => {
    component.form.patchValue({ nombre: '', apellido: '' });
    component.save();
    expect(component.loading).toBeFalse();
    expect(component.success).toBeNull();
  });

  it('save actualiza usuario y deja success en true', () => {
    component.form.patchValue({
      nombre: 'Nuevo',
      apellido: 'Nombre',
      correo: 'nuevo@example.com',
      telefono: '999'
    });
    mockUsuarios.update.and.returnValue(of({ ...user, nombre: 'Nuevo', apellido: 'Nombre', correo: 'nuevo@example.com', telefono: '999' }));
    component.save();
    expect(component.loading).toBeFalse();
    expect(mockUsuarios.update).toHaveBeenCalled();
    expect(mockAuth.currentUserValue?.nombre).toBe('Nuevo');
    expect(mockAuth.setCurrentUser).toHaveBeenCalled();
    expect(component.error).toBeNull();
    expect(component.success).toBeTruthy();
  });

  it('save muestra error cuando no hay usuario', () => {
    mockAuth.currentUserSubject.next(null);
    component.save();
    expect(component.error).toContain('No hay usuario');
  });

  it('cancel sin usuario no lanza error', () => {
    mockAuth.currentUserSubject.next(null);
    component.cancel();
    expect(component.error).toBeNull();
  });
});
