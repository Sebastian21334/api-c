import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordPage {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = signal(false);
  loading = signal(false);
  invalidLink = signal(false);

  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.invalidLink.set(true);
    } else {
      this.token = token;
    }
  }

  async submit(): Promise<void> {
    this.error = '';

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    if (this.password.length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    this.loading.set(true);
    try {
      await firstValueFrom(this.auth.resetPassword(this.token, this.password));
      this.success.set(true);
    } catch (err: any) {
      this.error = err.error?.message || 'Token inválido o expirado';
    } finally {
      this.loading.set(false);
    }
  }
}