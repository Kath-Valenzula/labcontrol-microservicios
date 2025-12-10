import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MainLayoutComponent } from './main-layout.component';
import { AuthService } from '../../core/services/auth.service';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  const mockAuth: any = {
    currentUserValue: {
      nombre: 'Ana',
      apellido: 'Admin',
      rol: 'ADMIN'
    },
    logout: jasmine.createSpy('logout')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuth }]
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('inicializa nombre y rol del usuario', () => {
    expect(component.currentUserName).toBe('Ana Admin');
    expect(component.currentUserRole).toBe('ADMIN');
  });

  it('hasRole retorna true para roles permitidos', () => {
    expect(component.hasRole(['ADMIN', 'MEDICO'])).toBeTrue();
    expect(component.hasRole(['PATIENT'])).toBeFalse();
  });

  it('toggleSidebar alterna el estado de isCollapsed', () => {
    expect(component.isCollapsed).toBeFalse();
    component.toggleSidebar();
    expect(component.isCollapsed).toBeTrue();
  });

  it('logout delega en AuthService y navega a login', () => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);
    component.logout();
    expect(mockAuth.logout).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/auth/login']);
  });
});
