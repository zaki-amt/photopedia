import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Body() dto: UploadMediaDto,
  ) {
    return this.mediaService.uploadFile(file, dto);
  }

  @Get('url/*')
  async getUrl(@Param('0') key: string) {
    const url = await this.mediaService.getPublicUrl(key);
    return { url, key };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':key(*)')
  async deleteFile(@Param('key') key: string) {
    const success = await this.mediaService.deleteFile(key);
    return { success, key };
  }
}
