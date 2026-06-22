import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify-pending',
  imports: [],
  templateUrl: './verify-pending.html',
  styleUrl: './verify-pending.css',
})
export class VerifyPendingPage {
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  loading = signal(false);

  async resend(): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.auth.resendVerification());
      this.toast.success(res.message || 'Email reenviado');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al reenviar el email');
    } finally {
      this.loading.set(false);
    }
  }
}