import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../core/services/usuarios.service';
import { Usuario } from '../../models/usuario.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: Usuario[] = [];
  loading = false;
  error: string | null = null;

  constructor(private srv: UsuariosService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.srv.getAll().subscribe({
      next: (data: Usuario[]) => {
        this.users = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Error al cargar usuarios.';
        this.loading = false;
      }
    });
  }

  edit(id: number) { this.router.navigate(['/usuarios', id, 'editar']); }

  create() { this.router.navigate(['/usuarios', 'nuevo']); }

  remove(id: number) {
    if (!confirm('Eliminar usuario? Esta accion no se puede deshacer.')) return;
    this.srv.delete(id).subscribe({ next: () => this.load(), error: () => alert('Error al eliminar usuario.') });
  }
}

