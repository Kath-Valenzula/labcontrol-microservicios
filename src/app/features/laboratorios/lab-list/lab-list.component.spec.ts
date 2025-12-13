import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { LabListComponent } from './lab-list.component';
import { LaboratoriosService } from '../../../core/services/laboratorios.service';

describe('LabListComponent', () => {
  let component: LabListComponent;
  let fixture: ComponentFixture<LabListComponent>;

  const mockSrv = {
    getAll: jasmine.createSpy('getAll').and.returnValue(of([{ id: 1, nombre: 'Lab', direccion: 'Dir', telefono: '123' }])),
    delete: jasmine.createSpy('delete').and.returnValue(of(void 0))
  };

  beforeEach(async () => {
    if ((window.confirm as any).and) {
      (window.confirm as jasmine.Spy).and.returnValue(true);
    } else {
      spyOn(window, 'confirm').and.returnValue(true);
    }
    mockSrv.getAll.calls.reset();
    mockSrv.delete.calls.reset();
    await TestBed.configureTestingModule({
      imports: [LabListComponent, RouterTestingModule],
      providers: [{ provide: LaboratoriosService, useValue: mockSrv }]
    }).compileComponents();
    fixture = TestBed.createComponent(LabListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('carga laboratorios en ngOnInit', () => {
    expect(mockSrv.getAll).toHaveBeenCalled();
    expect(component.labs.length).toBe(1);
  });

  it('create navega a nuevo', () => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');
    component.create();
    expect(navSpy).toHaveBeenCalledWith(['/laboratorios', 'nuevo']);
  });

  it('edit navega a editar', () => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');
    component.edit(5);
    expect(navSpy).toHaveBeenCalledWith(['/laboratorios', 5, 'editar']);
  });

  it('remove llama delete y recarga', () => {
    const reloadSpy = spyOn(component, 'load').and.callThrough();
    component.remove(2);
    expect(mockSrv.delete).toHaveBeenCalledWith(2);
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('remove no elimina si usuario cancela confirm', () => {
    mockSrv.delete.calls.reset();
    const confirmSpy = window.confirm as jasmine.Spy;
    confirmSpy.calls.reset();
    confirmSpy.and.returnValue(false);
    component.remove(3);
    expect(mockSrv.delete).not.toHaveBeenCalled();
  });
});
