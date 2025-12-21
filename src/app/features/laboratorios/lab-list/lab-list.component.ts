import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LaboratoriosService } from '../../../core/services/laboratorios.service';
import { Laboratorio } from '../../../models/laboratorio.model';

@Component({
  selector: 'app-lab-list',
  templateUrl: './lab-list.component.html',
  styleUrls: ['./lab-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class LabListComponent implements OnInit {
  labs: Laboratorio[] = [];
  readonly sampleLabs: Laboratorio[] = [
    { id: 1, nombre: 'Lab Redes', ubicacion: 'Edificio B, Sala 203', capacidad: 30, encargadoId: 1 },
    { id: 2, nombre: 'Lab Programacion', ubicacion: 'Edificio A, Sala 101', capacidad: 25, encargadoId: 2 },
    { id: 3, nombre: 'Lab Electronica', ubicacion: 'Edificio C, Sala 305', capacidad: 20, encargadoId: 3 },
    { id: 21, nombre: 'Laboratorio de Pruebas', ubicacion: 'Edificio A - Piso 3', capacidad: 25 }
  ];
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

  get headerLabs(): Laboratorio[] {
    return this.labs.length ? this.labs : this.sampleLabs;
  }

  edit(id: number) { this.router.navigate(['/laboratorios', id, 'editar']); }

  create() { this.router.navigate(['/laboratorios', 'nuevo']); }

  remove(id: number) {
    if (!confirm('Eliminar laboratorio? Esta accion no se puede deshacer.')) return;
    this.srv.delete(id).subscribe({ next: () => this.load(), error: () => alert('Error al eliminar laboratorio.') });
  }
}

