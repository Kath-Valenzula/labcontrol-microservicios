
import { Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegistroComponent } from './features/auth/registro/registro.component';
import { RecuperarPasswordComponent } from './features/auth/recuperar-password/recuperar-password.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { LabListComponent } from './features/laboratorios/lab-list/lab-list.component';
import { LabFormComponent } from './features/laboratorios/lab-form/lab-form.component';
import { ResultListComponent } from './features/resultados/result-list/result-list.component';
import { ResultFormComponent } from './features/resultados/result-form/result-form.component';
import { MisResultadosComponent } from './features/resultados/mis-resultados.component';
import { ProfileComponent } from './users/profile/profile.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegistroComponent },
      { path: 'forgot-password', component: RecuperarPasswordComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, canActivate: [RoleGuard] },
      { path: 'laboratorios', component: LabListComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'MEDICO'] } },
      { path: 'laboratorios/nuevo', component: LabFormComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
      { path: 'laboratorios/:id', component: LabFormComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
      { path: 'resultados', component: ResultListComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'MEDICO'] } },
      { path: 'resultados/nuevo', component: ResultFormComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'MEDICO'] } },
      { path: 'resultados/:id', component: ResultFormComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'MEDICO'] } },
      { path: 'mis-resultados', component: MisResultadosComponent, canActivate: [RoleGuard], data: { roles: ['PATIENT'] } },
      { path: 'perfil', component: ProfileComponent, canActivate: [RoleGuard] }
    ]
  },
  { path: '**', redirectTo: '' }
];
