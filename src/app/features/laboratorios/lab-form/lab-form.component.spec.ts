import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LabFormComponent } from './lab-form.component';
import { LaboratoriosService } from '../../../core/services/laboratorios.service';

describe('LabFormComponent', () => {
  let component: LabFormComponent;
  let fixture: ComponentFixture<LabFormComponent>;
  const mockSrv = {
    getById: jasmine.createSpy('getById').and.returnValue(of({ nombre: 'Lab', ubicacion: 'Dir', capacidad: 10, encargadoId: null })),
    update: jasmine.createSpy('update').and.returnValue(of({})),
    create: jasmine.createSpy('create').and.returnValue(of({}))
  };
  let currentId: string | null = null;
  const routeStub = { snapshot: { paramMap: { get: (_: string) => currentId } } };

  function buildComponent() {
    fixture = TestBed.createComponent(LabFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabFormComponent, RouterTestingModule],
      providers: [
        { provide: LaboratoriosService, useValue: mockSrv },
        { provide: ActivatedRoute, useValue: routeStub }
      ]
    }).compileComponents();
    mockSrv.getById.calls.reset();
    mockSrv.update.calls.reset();
    mockSrv.create.calls.reset();
  });

  it('en modo crear llama create y navega', () => {
    currentId = null;
    buildComponent();
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);
    component.form.patchValue({ nombre: 'N', ubicacion: 'D', capacidad: 5 });
    component.submit();
    expect(mockSrv.create).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/laboratorios']);
  });

  it('en modo edicion carga datos y hace update', () => {
    currentId = '7';
    buildComponent();
    expect(component.isEdit).toBeTrue();
    expect(mockSrv.getById).toHaveBeenCalledWith(7);
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);
    component.form.patchValue({ nombre: 'X', ubicacion: 'Y', capacidad: 2 });
    component.submit();
    expect(mockSrv.update).toHaveBeenCalledWith(7, jasmine.any(Object));
    expect(navSpy).toHaveBeenCalledWith(['/laboratorios']);
  });

  it('load maneja error al traer datos', () => {
    currentId = '9';
    mockSrv.getById.and.returnValue(throwError(() => ({ error: { message: 'fail' } })));
    buildComponent();
    expect(component.error).toBe('No se pudo cargar laboratorio.');
  });
});
