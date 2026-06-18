import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-pending',
  imports: [],
  templateUrl: './verify-pending.html',
  styleUrl: './verify-pending.css',
})
export class VerifyPendingPage {
  private auth = inject(AuthService);

  loading = signal(false);
  message = signal('');
  error = signal('');

  async resend(): Promise<void> {
    this.loading.set(true);
    this.message.set('');
    this.error.set('');
    try {
      const res = await firstValueFrom(this.auth.resendVerification());
      this.message.set(res.message);
    } catch (err: any) {
      this.error.set(err.error?.message || 'Error al reenviar el email');
    } finally {
      this.loading.set(false);
    }
  }
}