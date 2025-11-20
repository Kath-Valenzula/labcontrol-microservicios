import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
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

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.maxLength(30)]]
    });
  }

  ngOnInit(): void {
    const user: Usuario | null = this.auth.currentUserValue;
    if (user) {
      this.form.patchValue({
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        telefono: user.telefono || ''
      });
    }
  }

  get f() { return this.form.controls; }

  cancel() {
    const user = this.auth.currentUserValue;
    if (user) {
      this.form.patchValue({
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        telefono: user.telefono || ''
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

    // Preferir usar UsuariosService si existe; AuthService puede mantener el usuario local.
    // Aquí actualizamos mediante AuthService y dejamos TODO para llamada real al backend.
    // TODO: Reemplazar por `UsuariosService.update(currentUser.id, payload)` cuando el endpoint exista.
    const current = this.auth.currentUserValue;
    if (!current) {
      this.loading = false; this.error = 'No hay usuario autenticado.'; return;
    }

    // Simulación local: actualizar el usuario en el BehaviorSubject y storage
    const updated: Usuario = { ...current, ...payload } as Usuario;
    // Si el backend está disponible, AuthService debería exponer un método para actualizar.
    // Para mantener consistencia, guardamos localmente y mostramos éxito.
    setTimeout(() => {
      try {
        // Accedemos a propiedades internas con cast para demo local
        (this.auth as any).currentUserSubject.next(updated);
        (this.auth as any).saveUserToStorage && (this.auth as any).saveUserToStorage(updated);
      } catch {}
      this.loading = false;
      this.success = 'Perfil actualizado localmente.';
    }, 700);
  }
}
