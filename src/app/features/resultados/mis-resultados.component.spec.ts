import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MisResultadosComponent } from './mis-resultados.component';
import { ResultadosService } from '../../core/services/resultados.service';
import { AuthService } from '../../core/services/auth.service';

describe('MisResultadosComponent', () => {
  let component: MisResultadosComponent;
  let fixture: ComponentFixture<MisResultadosComponent>;
  const mockSrv = {
    getByPacienteId: jasmine.createSpy('getByPacienteId').and.returnValue(of([{ id: 1, resultado: 'OK' } as any]))
  };
  const mockAuth: any = { currentUserValue: { id: 7, rol: 'PATIENT' } };

  function build() {
    fixture = TestBed.createComponent(MisResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    mockAuth.currentUserValue = { id: 7, rol: 'PATIENT' };
    mockSrv.getByPacienteId.calls.reset();
    mockSrv.getByPacienteId.and.returnValue(of([{ id: 1, resultado: 'OK' } as any]));
    await TestBed.configureTestingModule({
      imports: [MisResultadosComponent],
      providers: [
        { provide: ResultadosService, useValue: mockSrv },
        { provide: AuthService, useValue: mockAuth }
      ]
    }).compileComponents();
    mockSrv.getByPacienteId.calls.reset();
  });

  it('carga resultados cuando el usuario es paciente', () => {
    mockAuth.currentUserValue = { id: 7, rol: 'PATIENT' };
    build();
    expect(mockSrv.getByPacienteId).toHaveBeenCalledWith(7);
    expect(component.results.length).toBe(1);
  });

  it('muestra error si no es paciente', () => {
    mockAuth.currentUserValue = { id: 3, rol: 'ADMIN' };
    build();
    expect(component.error).toContain('Solo los pacientes');
  });

  it('maneja error al cargar resultados', () => {
    mockAuth.currentUserValue = { id: 7, rol: 'PATIENT' };
    mockSrv.getByPacienteId.and.returnValue(throwError(() => ({ error: { message: 'fail' } })));
    build();
    expect(component.error).toBe('fail');
  });
});
