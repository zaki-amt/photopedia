import {
  Controller,
  Get,
  Post,
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
  async getFeed(@Query('category') category?: string) {
    return this.postsService.findAllFeed(category);
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
}
