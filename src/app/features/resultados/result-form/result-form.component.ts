import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResultadosService } from '../../../core/services/resultados.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-result-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './result-form.component.html',
  styleUrls: ['./result-form.component.scss']
})
export class ResultFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  isEdit = false;
  id: number | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private srv: ResultadosService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      pacienteId: ['', [Validators.required]],
      laboratorioId: ['', [Validators.required]],
      tipoExamen: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      resultado: ['', [Validators.required]],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) { this.isEdit = true; this.id = Number(param); this.load(); }
  }

  load() { if (!this.id) return; this.loading = true; this.srv.getById(this.id).subscribe({ next: data => { this.form.patchValue(data); this.loading = false; }, error: () => { this.error = 'No se pudo cargar resultado.'; this.loading = false; } }); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = null; const payload = this.form.value;
    if (this.isEdit && this.id) {
      this.srv.update(this.id, payload).subscribe({ next: () => this.router.navigate(['/resultados']), error: () => { this.error = 'Error al actualizar.'; this.loading = false; } });
    } else {
      this.srv.create(payload).subscribe({ next: () => this.router.navigate(['/resultados']), error: () => { this.error = 'Error al crear resultado.'; this.loading = false; } });
    }
  }
}
