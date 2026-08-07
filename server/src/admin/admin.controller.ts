import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  private checkAdmin(req: any) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Administrator role required');
    }
  }

  @Get('metrics')
  async getMetrics(@Request() req: any) {
    this.checkAdmin(req);
    return this.adminService.getOverviewMetrics();
  }

  @Get('users')
  async getUsers(@Request() req: any) {
    this.checkAdmin(req);
    return this.adminService.getAllUsers();
  }

  @Post('users/:id/role')
  async toggleRole(@Request() req: any, @Param('id') userId: string) {
    this.checkAdmin(req);
    return this.adminService.toggleUserRole(userId);
  }

  @Get('moderation')
  async getModeration(@Request() req: any) {
    this.checkAdmin(req);
    return this.adminService.getModerationQueue();
  }

  @Post('moderation/:id')
  async updateModeration(
    @Request() req: any,
    @Param('id') logId: string,
    @Body('status') status: 'APPROVED' | 'REMOVED',
  ) {
    this.checkAdmin(req);
    return this.adminService.updateModerationStatus(logId, status);
  }
}
