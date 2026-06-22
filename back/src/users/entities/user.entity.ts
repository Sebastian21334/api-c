import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { UserRole } from '../user-role.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  passwordHash!: string;

  @Column({ type: 'text', default: UserRole.USER })
  role!: UserRole;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ nullable: true, type: 'varchar' })
  verificationToken!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  resetPasswordToken!: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  resetPasswordExpires!: Date | null;

  createdAt!: Date;
}