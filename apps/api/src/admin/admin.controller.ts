import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateModerationDto } from './dto/update-moderation.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('metrics')
  getMetrics() {
    return this.adminService.getOverviewMetrics();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getAllUsers();
  }

  @Post('users/:id/role')
  toggleRole(@Param('id') id: string) {
    return this.adminService.toggleUserRole(id);
  }

  @Post('users/:id/status')
  toggleStatus(@Param('id') id: string) {
    return this.adminService.toggleUserStatus(id);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('moderation')
  getModerationQueue() {
    return this.adminService.getModerationQueue();
  }

  @Post('moderation/:id')
  updateModeration(
    @Param('id') id: string,
    @Body() dto: UpdateModerationDto,
  ) {
    return this.adminService.updateModerationStatus(id, dto.status);
  }
}
