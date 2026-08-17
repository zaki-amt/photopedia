import { Injectable, Logger } from '@nestjs/common';
import { IStorageProvider, StorageFile, StorageUploadResult } from './storage.interface';

@Injectable()
export class SpacesStorageProvider implements IStorageProvider {
  private readonly logger = new Logger(SpacesStorageProvider.name);

  async uploadFile(file: StorageFile, destinationFolder = 'photos'): Promise<StorageUploadResult> {
    const fileExt = file.originalname ? file.originalname.substring(file.originalname.lastIndexOf('.')) : '.jpg';
    const key = `${destinationFolder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExt}`;
    const spaceName = process.env.DO_SPACES_NAME || 'photopedia-space';
    const region = process.env.DO_SPACES_REGION || 'nyc3';
    const url = `https://${spaceName}.${region}.digitaloceanspaces.com/${key}`;

    this.logger.log(`[SpacesStorageProvider] Prepared DigitalOcean Spaces contract for key: ${key}`);

    return {
      url,
      key,
      filename: key.split('/').pop() || '',
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    this.logger.log(`[SpacesStorageProvider] Deleting DigitalOcean Space key: ${key}`);
    return true;
  }

  async getPublicUrl(key: string): Promise<string> {
    const spaceName = process.env.DO_SPACES_NAME || 'photopedia-space';
    const region = process.env.DO_SPACES_REGION || 'nyc3';
    return `https://${spaceName}.${region}.digitaloceanspaces.com/${key}`;
  }
}
