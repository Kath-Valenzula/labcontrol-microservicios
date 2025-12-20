import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  loading = false;
  success: string | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private usuarios: UsuariosService) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.maxLength(30)]],
      rol: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    const user: Usuario | null = this.auth.currentUserValue;
    if (user) {
      this.form.patchValue({
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        telefono: user.telefono || '',
        rol: user.rol || ''
      });
    }
  }

  get f() { return this.form.controls; }
  get initials(): string {
    const n = this.form.getRawValue();
    return `${(n.nombre || 'U')[0] ?? ''}${(n.apellido || 'N')[0] ?? ''}`.toUpperCase();
  }

  cancel() {
    const user = this.auth.currentUserValue;
    if (user) {
      this.form.patchValue({
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        telefono: user.telefono || '',
        rol: user.rol || ''
      });
    }
    this.success = null; this.error = null;
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = null; this.success = null;
    const payload: Partial<Usuario> = {
      nombre: this.f['nombre'].value,
      apellido: this.f['apellido'].value,
      correo: this.f['correo'].value,
      telefono: this.f['telefono'].value
    };

    const current = this.auth.currentUserValue;
    if (!current) {
      this.loading = false; this.error = 'No hay usuario autenticado.'; return;
    }

    this.usuarios.update(current.id, payload).subscribe({
      next: (updated) => {
        const merged: Usuario = { ...current, ...updated };
        this.auth.setCurrentUser(merged);
        this.loading = false;
        this.success = 'Perfil actualizado correctamente.';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al actualizar perfil.';
      }
    });
  }
}
