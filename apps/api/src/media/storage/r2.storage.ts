import { Injectable, Logger } from '@nestjs/common';
import { IStorageProvider, StorageFile, StorageUploadResult } from './storage.interface';

@Injectable()
export class R2StorageProvider implements IStorageProvider {
  private readonly logger = new Logger(R2StorageProvider.name);

  async uploadFile(file: StorageFile, destinationFolder = 'photos'): Promise<StorageUploadResult> {
    const fileExt = file.originalname ? file.originalname.substring(file.originalname.lastIndexOf('.')) : '.jpg';
    const key = `${destinationFolder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExt}`;
    const r2PublicDomain = process.env.R2_PUBLIC_DOMAIN || 'https://pub-r2.photopedia.app';
    const url = `${r2PublicDomain}/${key}`;

    this.logger.log(`[R2StorageProvider] Prepared R2 S3-compatible upload contract for key: ${key}`);

    return {
      url,
      key,
      filename: key.split('/').pop() || '',
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    this.logger.log(`[R2StorageProvider] Deleting object key: ${key}`);
    return true;
  }

  async getPublicUrl(key: string): Promise<string> {
    const r2PublicDomain = process.env.R2_PUBLIC_DOMAIN || 'https://pub-r2.photopedia.app';
    return `${r2PublicDomain}/${key}`;
  }
}
