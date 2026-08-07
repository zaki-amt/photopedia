import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getFeed(
    @Query("category") category?: string,
    @Query("feed") feedType?: string,
    @Query("search") search?: string,
    @Request() req?: any,
  ) {
    const authHeader = req?.headers?.authorization;
    let userId: string | undefined = undefined;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        const jwt = require("jsonwebtoken");
        const decoded = jwt.decode(token);
        if (decoded && decoded.sub) {
          userId = decoded.sub;
        }
      } catch (e) {
        // Optional auth
      }
    }
    return this.postsService.findAllFeed(category, feedType, userId, search);
  }

  @Get('top-categories')
  async getTopCategories() {
    return this.postsService.getTopCategories();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Request() req: any,
    @Body()
    body: {
      title: string;
      image: string;
      caption?: string;
      category: string;
      tags?: string[];
      camera?: string;
      lens?: string;
      aperture?: string;
      shutter?: string;
      iso?: string;
    },
  ) {
    return this.postsService.create(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/like')
  async toggleLike(@Request() req: any, @Param('id') id: string) {
    return this.postsService.toggleLike(req.user.id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comment')
  async addComment(
    @Request() req: any,
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    return this.postsService.addComment(req.user.id, id, content);
  }

  @Post(':id/flag')
  async flagPost(
    @Param('id') id: string,
    @Body('reason') reason?: string,
    @Request() req?: any,
  ) {
    const userId = req?.user?.id;
    return this.postsService.flagPost(id, reason, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Request() req: any,
    @Body()
    body: {
      title?: string;
      caption?: string;
      category?: string;
      tags?: string[];
      camera?: string;
      lens?: string;
      aperture?: string;
      shutter?: string;
      iso?: string;
    },
  ) {
    return this.postsService.updatePost(id, req.user.id, req.user.role, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async removePost(@Param('id') id: string, @Request() req: any) {
    return this.postsService.removePost(id, req.user.id, req.user.role);
  }
}
