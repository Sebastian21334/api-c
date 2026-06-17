import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { UserRole } from '../../users/user-role.enum';
import { randomUUID } from 'crypto'; 
import { EmailService } from '../../email/services/email.service';

@Injectable()
export class AuthService {
  constructor(
  @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly cfg: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(email: string, password: string) {
    const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
    const passwordHash = await bcrypt.hash(password, rounds);
    const countUsers = await this.usersRepo.count();
    const role = countUsers === 0 ? UserRole.ADMIN : UserRole.USER;
    const entity = this.usersRepo.create({
      email: email.trim().toLowerCase(),
      passwordHash,
      role,
    });
    entity.verificationToken = randomUUID();
    entity.isVerified = false;
    try {
      await this.usersRepo.save(entity);
    } catch {
      throw new ConflictException('Email ya registrado');
    }
     await this.emailService.sendVerificationEmail(entity.email, entity.verificationToken);

    return { id: entity.id, email: entity.email, role: entity.role };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email: email.trim().toLowerCase() })
      .getOne();
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');
    const access_token = this.jwtService.sign({
      sub: user.id,
      role: user.role,
    });
    return { access_token };
  }
  

  async verifyEmail(token: string) {
    const user = await this.usersRepo.findOne({
      where: { verificationToken: token }
    });

    if (!user) {throw new BadRequestException('Token inválido o expirado');}

    user.isVerified = true;
    user.verificationToken = null;
    await this.usersRepo.save(user);

    return { message: 'Email verificado' };
  }

  async resendVerification(userId: string) {
  const user = await this.usersRepo.findOne({ where: { id: userId } });
  if (!user) {
    throw new UnauthorizedException();
  }
  if (user.isVerified) {
    return { message: 'El email ya está verificado' };
  }
  user.verificationToken = randomUUID();
  await this.usersRepo.save(user);
  await this.emailService.sendVerificationEmail(user.email, user.verificationToken); // ✅ cambio acá
  return { message: 'Email reenviado' };
}


  async getMe(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }


}