import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('suggested')
  async getSuggested() {
    return this.usersService.getSuggestedCreators();
  }

  @Get(':username')
  async getProfile(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  async updateProfile(
    @Request() req: any,
    @Body() dto: { name?: string; username?: string; email?: string; avatar?: string; bio?: string },
  ) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/follow')
  async toggleFollow(@Request() req: any, @Param('id') targetUserId: string) {
    return this.usersService.toggleFollow(req.user.id, targetUserId);
  }
}
