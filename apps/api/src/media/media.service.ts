import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import { STORAGE_PROVIDER, IStorageProvider, StorageFile } from './storage/storage.interface';
import { UploadMediaDto } from './dto/upload-media.dto';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @Inject(STORAGE_PROVIDER) private readonly storageProvider: IStorageProvider,
  ) {}

  async uploadFile(file: any, dto?: UploadMediaDto) {
    if (!file) {
      throw new BadRequestException('No file provided for upload');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/avif',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Supported formats: JPEG, PNG, WEBP, GIF, AVIF.`,
      );
    }

    // 15MB file size limit check
    const maxSizeBytes = 15 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new BadRequestException('File size exceeds maximum allowed limit of 15MB');
    }

    const storageFile: StorageFile = {
      buffer: file.buffer,
      originalname: file.originalname || 'upload.jpg',
      mimetype: file.mimetype,
      size: file.size,
    };

    const destinationFolder = dto?.folder || 'photos';
    return this.storageProvider.uploadFile(storageFile, destinationFolder);
  }

  async deleteFile(key: string) {
    if (!key) {
      throw new BadRequestException('Media key is required');
    }
    return this.storageProvider.deleteFile(key);
  }

  async getPublicUrl(key: string) {
    if (!key) {
      throw new BadRequestException('Media key is required');
    }
    return this.storageProvider.getPublicUrl(key);
  }
}
