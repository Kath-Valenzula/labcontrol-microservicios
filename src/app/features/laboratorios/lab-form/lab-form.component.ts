import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LaboratoriosService } from '../../../core/services/laboratorios.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lab-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lab-form.component.html',
  styleUrls: ['./lab-form.component.scss']
})
export class LabFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  isEdit = false;
  id: number | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private srv: LaboratoriosService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['']
    });
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.isEdit = true; this.id = Number(param); this.load();
    }
  }

  load() {
    if (!this.id) return;
    this.loading = true; this.srv.getById(this.id).subscribe({ next: data => { this.form.patchValue(data); this.loading = false; }, error: () => { this.error = 'No se pudo cargar laboratorio.'; this.loading = false; } });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = null;
    const payload = this.form.value;
    if (this.isEdit && this.id) {
      this.srv.update(this.id, payload).subscribe({ next: () => this.router.navigate(['/laboratorios']), error: () => { this.error = 'Error al actualizar.'; this.loading = false; } });
    } else {
      this.srv.create(payload).subscribe({ next: () => this.router.navigate(['/laboratorios']), error: () => { this.error = 'Error al crear laboratorio.'; this.loading = false; } });
    }
  }
}
