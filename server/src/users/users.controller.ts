import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
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

  @UseGuards(AuthGuard('jwt'))
  @Get('me/following-ids')
  async getMyFollowingIds(@Request() req: any) {
    return this.usersService.getFollowingIds(req.user.id);
  }

  @Get(':username/followers')
  async getFollowers(@Param('username') username: string) {
    return this.usersService.getFollowers(username);
  }

  @Get(':username/following')
  async getFollowing(@Param('username') username: string) {
    return this.usersService.getFollowing(username);
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
  async toggleFollow(@Request() req: any, @Param('id') targetIdentifier: string) {
    return this.usersService.followUser(req.user.id, targetIdentifier);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/follow')
  async unfollow(@Request() req: any, @Param('id') targetIdentifier: string) {
    return this.usersService.unfollowUser(req.user.id, targetIdentifier);
  }
}
