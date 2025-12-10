import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ResultFormComponent } from './result-form.component';
import { ResultadosService } from '../../../core/services/resultados.service';

describe('ResultFormComponent', () => {
  let component: ResultFormComponent;
  let fixture: ComponentFixture<ResultFormComponent>;
  const mockSrv = {
    getById: jasmine.createSpy('getById').and.returnValue(of({
      pacienteId: 1,
      laboratorioId: 2,
      tipoExamen: 'X',
      fecha: '2024-01-01',
      resultado: 'OK',
      observaciones: ''
    })),
    update: jasmine.createSpy('update').and.returnValue(of({})),
    create: jasmine.createSpy('create').and.returnValue(of({}))
  };
  let currentId: string | null = null;
  const routeStub = { snapshot: { paramMap: { get: (_: string) => currentId } } };

  function buildComponent() {
    fixture = TestBed.createComponent(ResultFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultFormComponent, RouterTestingModule],
      providers: [
        { provide: ResultadosService, useValue: mockSrv },
        { provide: ActivatedRoute, useValue: routeStub }
      ]
    }).compileComponents();
    mockSrv.getById.calls.reset();
    mockSrv.update.calls.reset();
    mockSrv.create.calls.reset();
  });

  it('crea resultado cuando no hay id', () => {
    currentId = null;
    buildComponent();
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);
    component.form.patchValue({
      pacienteId: 1,
      laboratorioId: 2,
      tipoExamen: 'A',
      fecha: '2024-01-02',
      resultado: 'Bien',
      observaciones: ''
    });
    component.submit();
    expect(mockSrv.create).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/resultados']);
  });

  it('edita resultado cuando hay id', () => {
    currentId = '4';
    buildComponent();
    expect(component.isEdit).toBeTrue();
    expect(mockSrv.getById).toHaveBeenCalledWith(4);
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);
    component.form.patchValue({
      pacienteId: 9,
      laboratorioId: 8,
      tipoExamen: 'B',
      fecha: '2024-01-03',
      resultado: 'Act',
      observaciones: 'obs'
    });
    component.submit();
    expect(mockSrv.update).toHaveBeenCalledWith(4, jasmine.any(Object));
    expect(navSpy).toHaveBeenCalledWith(['/resultados']);
  });

  it('load maneja error al traer resultado', () => {
    currentId = '10';
    mockSrv.getById.and.returnValue(throwError(() => ({ error: { message: 'fail' } })));
    buildComponent();
    expect(component.error).toBe('No se pudo cargar resultado.');
  });
});
