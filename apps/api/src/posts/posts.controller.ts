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
import { CreatePostDto, UpdatePostDto, FlagPostDto, AddCommentDto } from './dto';

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
        const parts = token.split('.');
        if (parts.length === 3) {
          const payloadJson = Buffer.from(parts[1], 'base64').toString('utf8');
          const decoded = JSON.parse(payloadJson);
          if (decoded && decoded.sub) {
            userId = decoded.sub;
          }
        }
      } catch (e) {
        // Optional auth decoding fallback
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
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.create(req.user.id, dto);
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
    @Body() dto: AddCommentDto,
  ) {
    return this.postsService.addComment(req.user.id, id, dto.content);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/flag')
  async flagPost(
    @Param('id') id: string,
    @Body() dto: FlagPostDto,
    @Request() req: any,
  ) {
    return this.postsService.flagPost(id, dto.reason, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, req.user.id, req.user.role, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async removePost(@Param('id') id: string, @Request() req: any) {
    return this.postsService.removePost(id, req.user.id, req.user.role);
  }
}
