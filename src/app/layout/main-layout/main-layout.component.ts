import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  isCollapsed = false;
  currentUserName = '';
  currentUserRole: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const u = this.auth.currentUserValue;
    this.currentUserName = u ? `${u.nombre} ${u.apellido}` : '';
    this.currentUserRole = u ? u.rol : null;
  }

  hasRole(roles: string[]): boolean {
    return !!this.currentUserRole && roles.includes(this.currentUserRole);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
