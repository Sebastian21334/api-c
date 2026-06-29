import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../user-role.enum';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UpdateEmailDto } from '../dto/update-email.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { DeleteMeDto } from '../dto/delete-me.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Patch('me/password')
  updatePassword(@Request() req, @Body() dto: UpdatePasswordDto) {
    return this.usersService.updatePassword(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Patch('me/email')
  updateEmail(@Request() req, @Body() dto: UpdateEmailDto) {
    return this.usersService.updateEmail(
      req.user.id,
      dto.newEmail,
      dto.password,
    );
  }

  @Delete('me')
  deleteMe(@Request() req, @Body() dto: DeleteMeDto) {
    return this.usersService.deleteMe(req.user.id, dto.password);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateRole(@Request() req, @Param('id') targetId: string, @Body() dto: UpdateRoleDto) {
    return this.usersService.updateRole(req.user.id, targetId, dto.role);
  }
}