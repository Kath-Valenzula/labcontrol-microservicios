import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.scss']
})
export class RecuperarPasswordComponent {
  form: FormGroup;
  loading = false;
  message: string | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({ correo: ['', [Validators.required, Validators.email]] });
  }

  get f() { return this.form.controls; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.message = null; this.error = null;
    this.auth.forgotPassword(this.f['correo'].value).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = res?.message || 'Se ha enviado un correo con instrucciones.';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al intentar recuperar contrasena.';
      }
    });
  }
}

