import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailPage {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  loading = signal(true);
  success = signal(false);
  error = signal('');

  constructor() {
    this.verify();
  }

  private async verify(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.error.set('Token inválido o expirado');
      this.toast.error('Token inválido o expirado');
      this.loading.set(false);
      return;
    }
    try {
      await firstValueFrom(this.auth.verifyEmail(token));
      this.success.set(true);
      this.toast.success('Email verificado correctamente');

      if (this.auth.isAuthenticated()) {
        await firstValueFrom(this.auth.me());
      }
    } catch (err: any) {
      const message = err.error?.message || 'Token inválido o expirado';
      this.error.set(message);
      this.toast.error(message);
    } finally {
      this.loading.set(false);
    }
  }
}