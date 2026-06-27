import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly cfg: ConfigService,
  ) {}

  // GET /users — solo admin
  async findAll(): Promise<Omit<UserEntity, 'passwordHash'>[]> {
    return this.usersRepo.find({
      order: { createdAt: 'ASC' },
    });
  }

  // PATCH /users/:id/role — solo admin
  async updateRole(adminId: string, targetId: string, role: UserRole): Promise<UserEntity> {
    if (adminId === targetId) {
      throw new ForbiddenException('Cannot change your own role');
    }

    const target = await this.usersRepo.findOne({ where: { id: targetId } });
    if (!target) throw new NotFoundException('User not found');

    // No dejar degradar al único admin restante
    if (target.role === UserRole.ADMIN && role === UserRole.USER) {
      const adminCount = await this.usersRepo.count({ where: { role: UserRole.ADMIN } });
      if (adminCount <= 1) {
        throw new ForbiddenException('Cannot demote the only admin');
      }
    }

    target.role = role;
    return this.usersRepo.save(target);
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!user) throw new UnauthorizedException();

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) throw new BadRequestException('Contraseña actual incorrecta');

    const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
    user.passwordHash = await bcrypt.hash(newPassword, rounds);
    await this.usersRepo.save(user);

    return { message: 'Password updated' };
  }

  // PATCH /users/me/email — usuario logueado
  async updateEmail(userId: string, newEmail: string, password: string): Promise<{ message: string }> {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!user) throw new UnauthorizedException();

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new BadRequestException('Contraseña incorrecta');

    // Verificar que el nuevo email no esté ya en uso
    const existing = await this.usersRepo.findOne({
      where: { email: newEmail.trim().toLowerCase() },
    });
    if (existing) throw new ConflictException('Email ya registrado');

    user.email = newEmail.trim().toLowerCase();
    await this.usersRepo.save(user);

    return { message: 'Email updated' };
  }

  async deleteMe(userId: string, password: string): Promise<{ message: string }> {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!user) throw new UnauthorizedException();

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new BadRequestException('Contraseña incorrecta');

    await this.usersRepo.delete(userId);

    return { message: 'Account deleted' };
  }
}