import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailPage {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

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
      this.loading.set(false);
      return;
    }
    try {
      await firstValueFrom(this.auth.verifyEmail(token));
      this.success.set(true);
    } catch (err: any) {
      this.error.set(err.error?.message || 'Token inválido o expirado');
    } finally {
      this.loading.set(false);
    }
  }
}
