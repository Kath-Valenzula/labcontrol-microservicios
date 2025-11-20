import { Component, OnInit } from '@angular/core';
import { LaboratoriosService } from '../../../core/services/laboratorios.service';
import { Laboratorio } from '../../../models/laboratorio.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lab-list',
  templateUrl: './lab-list.component.html',
  styleUrls: ['./lab-list.component.scss']
})
export class LabListComponent implements OnInit {
  labs: Laboratorio[] = [];
  loading = false;
  error: string | null = null;

  constructor(private srv: LaboratoriosService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true; this.error = null;
    this.srv.getAll().subscribe({ next: data => { this.labs = data; this.loading = false; }, error: err => { this.error = err?.error?.message || 'Error al cargar laboratorios.'; this.loading = false; } });
  }

  edit(id: number) { this.router.navigate(['/laboratorios', id, 'editar']); }

  create() { this.router.navigate(['/laboratorios', 'nuevo']); }

  remove(id: number) {
    if (!confirm('¿Eliminar laboratorio? Esta acción no se puede deshacer.')) return;
    this.srv.delete(id).subscribe({ next: () => this.load(), error: () => alert('Error al eliminar laboratorio.') });
  }
}
