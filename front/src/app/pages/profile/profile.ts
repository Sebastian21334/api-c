import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);

  resending = signal(false);
  resendMessage = signal('');
  resendError = signal('');

  async resendVerification(): Promise<void> {
    this.resending.set(true);
    this.resendMessage.set('');
    this.resendError.set('');
    try {
      const res = await firstValueFrom(this.auth.resendVerification());
      this.resendMessage.set(res.message);
    } catch (err: any) {
      this.resendError.set(err.error?.message || 'Error al reenviar el email');
    } finally {
      this.resending.set(false);
    }
  }
}