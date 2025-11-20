import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResultadosService } from '../../core/services/resultados.service';
import { AuthService } from '../../core/services/auth.service';
import { ResultadoAnalisis } from '../../models/resultado-analisis.model';

@Component({
  selector: 'app-mis-resultados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-resultados.component.html',
  styleUrls: ['./mis-resultados.component.scss']
})
export class MisResultadosComponent implements OnInit {
  results: ResultadoAnalisis[] = [];
  loading = false;
  error: string | null = null;

  constructor(private srv: ResultadosService, private auth: AuthService) {}

  ngOnInit(): void {
    const user = this.auth.currentUserValue;
    if (user && user.rol === 'PATIENT') {
      this.loading = true;
      this.srv.getByPacienteId(user.id).subscribe({
        next: data => { this.results = data; this.loading = false; },
        error: err => { this.error = err?.error?.message || 'Error al cargar resultados.'; this.loading = false; }
      });
    } else {
      this.error = 'Solo los pacientes pueden ver sus resultados.';
    }
  }
}
