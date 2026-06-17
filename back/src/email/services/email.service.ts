import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private readonly cfg: ConfigService) {
    this.resend = new Resend(this.cfg.getOrThrow<string>('RESEND_API_KEY'));
  }

  async sendVerificationEmail(to: string, token: string) {
    const link = `http://localhost:4200/verify-email?token=${token}`;

    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Verificá tu email',
      html: `
        <h2>Verificá tu cuenta</h2>
        <p>Hacé click en el siguiente link para verificar tu email:</p>
        <a href="${link}">${link}</a>
      `,
    });
  }
}