import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ResultListComponent } from './result-list.component';
import { ResultadosService } from '../../../core/services/resultados.service';

describe('ResultListComponent', () => {
  let component: ResultListComponent;
  let fixture: ComponentFixture<ResultListComponent>;
  const mockSrv = {
    getAll: jasmine.createSpy('getAll').and.returnValue(of([{ id: 1, tipoExamen: 'X' } as any])),
    delete: jasmine.createSpy('delete').and.returnValue(of(void 0))
  };

  beforeEach(async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    await TestBed.configureTestingModule({
      imports: [ResultListComponent, RouterTestingModule],
      providers: [{ provide: ResultadosService, useValue: mockSrv }]
    }).compileComponents();
    fixture = TestBed.createComponent(ResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('carga resultados en ngOnInit', () => {
    expect(mockSrv.getAll).toHaveBeenCalled();
    expect(component.results.length).toBe(1);
  });

  it('create navega a nuevo', () => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');
    component.create();
    expect(navSpy).toHaveBeenCalledWith(['/resultados', 'nuevo']);
  });

  it('edit navega a editar', () => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');
    component.edit(9);
    expect(navSpy).toHaveBeenCalledWith(['/resultados', 9, 'editar']);
  });

  it('remove elimina y recarga', () => {
    const reloadSpy = spyOn(component, 'load').and.callThrough();
    component.remove(2);
    expect(mockSrv.delete).toHaveBeenCalledWith(2);
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('remove no elimina cuando se cancela confirm', () => {
    mockSrv.delete.calls.reset();
    const confirmSpy = window.confirm as jasmine.Spy;
    confirmSpy.calls.reset();
    confirmSpy.and.returnValue(false);
    component.remove(9);
    expect(mockSrv.delete).not.toHaveBeenCalled();
  });
});
