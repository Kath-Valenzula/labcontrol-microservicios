import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

function passwordMatchValidator(control: AbstractControl) {
  const pass = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pass === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  form: FormGroup;
  loading = false;
  successMsg: string | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      rol: ['PATIENT', [Validators.required]],
      passwords: this.fb.group({
        password: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[A-Z]/), // al menos una mayúscula
          Validators.pattern(/[a-z]/), // al menos una minúscula
          Validators.pattern(/[0-9]/), // al menos un número
          Validators.pattern(/[^A-Za-z0-9]/) // al menos un símbolo
        ]],
        confirmPassword: ['', [Validators.required]]
      }, { validators: passwordMatchValidator })
    });
  }

  get f() { return this.form.controls; }
  get p() { return (this.form.get('passwords') as FormGroup).controls; }

  // Helpers para usar desde la plantilla (evita regex literales en templates)
  hasUpper(): boolean {
    const v = this.p['password'].value || '';
    return /[A-Z]/.test(v);
  }

  hasLower(): boolean {
    const v = this.p['password'].value || '';
    return /[a-z]/.test(v);
  }

  hasNumber(): boolean {
    const v = this.p['password'].value || '';
    return /[0-9]/.test(v);
  }

  hasSymbol(): boolean {
    const v = this.p['password'].value || '';
    return /[^A-Za-z0-9]/.test(v);
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = null; this.successMsg = null;
    const payload = {
      nombre: this.f['nombre'].value,
      apellido: this.f['apellido'].value,
      correo: this.f['correo'].value,
      telefono: this.f['telefono'].value,
      rol: this.f['rol'].value,
      fechaRegistro: new Date().toISOString(),
      password: this.p['password'].value
    };
    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Registro exitoso. Ahora puedes iniciar sesión.';
        setTimeout(() => this.router.navigate(['/auth/login']), 1400);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al registrar usuario.';
      }
    });
  }
}
