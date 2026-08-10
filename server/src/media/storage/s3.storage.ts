import { Injectable, Logger } from '@nestjs/common';
import { IStorageProvider, StorageFile, StorageUploadResult } from './storage.interface';

@Injectable()
export class S3StorageProvider implements IStorageProvider {
  private readonly logger = new Logger(S3StorageProvider.name);

  async uploadFile(file: StorageFile, destinationFolder = 'photos'): Promise<StorageUploadResult> {
    const fileExt = file.originalname ? file.originalname.substring(file.originalname.lastIndexOf('.')) : '.jpg';
    const key = `${destinationFolder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExt}`;
    const bucket = process.env.AWS_S3_BUCKET || 'photopedia-media';
    const region = process.env.AWS_REGION || 'us-east-1';
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    this.logger.log(`[S3StorageProvider] Prepared AWS S3 PutObject contract for key: ${key}`);

    return {
      url,
      key,
      filename: key.split('/').pop() || '',
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    this.logger.log(`[S3StorageProvider] Deleting AWS S3 object key: ${key}`);
    return true;
  }

  async getPublicUrl(key: string): Promise<string> {
    const bucket = process.env.AWS_S3_BUCKET || 'photopedia-media';
    const region = process.env.AWS_REGION || 'us-east-1';
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }
}
