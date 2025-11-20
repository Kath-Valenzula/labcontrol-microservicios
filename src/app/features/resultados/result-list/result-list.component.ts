import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ResultadosService } from '../../../core/services/resultados.service';
import { ResultadoAnalisis } from '../../../models/resultado-analisis.model';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit {
  results: ResultadoAnalisis[] = [];
  loading = false;
  error: string | null = null;

  constructor(private srv: ResultadosService, private router: Router) {}

  ngOnInit(): void { this.load(); }

  load() { this.loading = true; this.error = null; this.srv.getAll().subscribe({ next: data => { this.results = data; this.loading = false; }, error: err => { this.error = err?.error?.message || 'Error al cargar resultados.'; this.loading = false; } }); }

  edit(id: number) { this.router.navigate(['/resultados', id, 'editar']); }
  create() { this.router.navigate(['/resultados', 'nuevo']); }
  remove(id: number) { if (!confirm('¿Eliminar resultado?')) return; this.srv.delete(id).subscribe({ next: () => this.load(), error: () => alert('Error al eliminar resultado.') }); }
}
