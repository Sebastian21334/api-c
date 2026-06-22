import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  private toast = inject(ToastService);

  // --- Reenvío de verificación (ya existía) ---
  resending = signal(false);

  async resendVerification(): Promise<void> {
    this.resending.set(true);
    try {
      await firstValueFrom(this.auth.resendVerification());
      this.toast.success('Email de verificación reenviado');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al reenviar el email');
    } finally {
      this.resending.set(false);
    }
  }

  // --- Cambiar contraseña ---
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  savingPassword = signal(false);

  async submitPassword(): Promise<void> {
    if (this.newPassword !== this.confirmPassword) {
      this.toast.error('Las contraseñas nuevas no coinciden');
      return;
    }
    if (this.newPassword.length < 8) {
      this.toast.error('La contraseña nueva debe tener al menos 8 caracteres');
      return;
    }
    this.savingPassword.set(true);
    try {
      await firstValueFrom(this.auth.updatePassword(this.currentPassword, this.newPassword));
      this.toast.success('Contraseña actualizada correctamente');
      // Limpiar campos después del éxito
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al cambiar la contraseña');
    } finally {
      this.savingPassword.set(false);
    }
  }

  // --- Cambiar email ---
  newEmail = '';
  emailPassword = '';
  savingEmail = signal(false);

  async submitEmail(): Promise<void> {
    this.savingEmail.set(true);
    try {
      await firstValueFrom(this.auth.updateEmail(this.newEmail, this.emailPassword));
      this.toast.success('Email actualizado correctamente');
      // Refrescar los datos del usuario para que el navbar y el perfil muestren el email nuevo
      await firstValueFrom(this.auth.me());
      // Limpiar campos
      this.newEmail = '';
      this.emailPassword = '';
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al cambiar el email');
    } finally {
      this.savingEmail.set(false);
    }
  }
}