import { IsIn } from 'class-validator';
import { UserRole } from '../user-role.enum';

export class UpdateRoleDto {
  @IsIn([UserRole.ADMIN, UserRole.USER])
  role!: UserRole;
}