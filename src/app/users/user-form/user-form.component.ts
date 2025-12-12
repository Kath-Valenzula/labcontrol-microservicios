import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../core/services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  isEdit = false;
  id: number | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private srv: UsuariosService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      rol: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) { this.isEdit = true; this.id = Number(param); this.load(); }
  }

  load() { if (!this.id) return; this.loading = true; this.srv.getById(this.id).subscribe({ next: (data: any) => { this.form.patchValue(data); this.loading = false; }, error: () => { this.error = 'No se pudo cargar usuario.'; this.loading = false; } }); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = null; const payload = this.form.value;
    if (this.isEdit && this.id) {
      this.srv.update(this.id, payload).subscribe({ next: () => this.router.navigate(['/usuarios']), error: () => { this.error = 'Error al actualizar.'; this.loading = false; } });
    } else {
      this.srv.create(payload).subscribe({ next: () => this.router.navigate(['/usuarios']), error: () => { this.error = 'Error al crear usuario.'; this.loading = false; } });
    }
  }
}
