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

/**
 * Step 1: Media Controller
 * Handles image file uploads (avatars, covers, photos) using Express Multer FileInterceptor.
 * Saves assets locally to 'server/uploads/' and returns accessible image URLs.
 */
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Step 2: Upload File Endpoint (POST /media/upload)
   * Intercepts multipart/form-data upload payloads and saves files to disk. Requires authentication.
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Body() dto: UploadMediaDto,
  ) {
    return this.mediaService.uploadFile(file, dto);
  }

  /**
   * Step 3: Get Public Image URL Endpoint (GET /media/url/*)
   * Resolves public HTTP static image URL for given file key.
   */
  @Get('url/*')
  async getUrl(@Param('0') key: string) {
    const url = await this.mediaService.getPublicUrl(key);
    return { url, key };
  }

  /**
   * Step 4: Delete File Endpoint (DELETE /media/:key)
   * Removes uploaded image file from local server filesystem.
   */
  @UseGuards(AuthGuard('jwt'))
  @Delete(':key(*)')
  async deleteFile(@Param('key') key: string) {
    const success = await this.mediaService.deleteFile(key);
    return { success, key };
  }
}
