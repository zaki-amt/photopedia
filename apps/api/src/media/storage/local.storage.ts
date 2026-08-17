import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IStorageProvider, StorageFile, StorageUploadResult } from './storage.interface';

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  private readonly logger = new Logger(LocalStorageProvider.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.baseUrl = process.env.APP_URL || process.env.BACKEND_URL || 'http://localhost:4000';
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: StorageFile, destinationFolder = 'photos'): Promise<StorageUploadResult> {
    const folderPath = path.join(this.uploadDir, destinationFolder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileExt = path.extname(file.originalname) || this.getExtensionFromMime(file.mimetype);
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExt}`;
    const filePath = path.join(folderPath, uniqueFilename);
    const key = `${destinationFolder}/${uniqueFilename}`;

    await fs.promises.writeFile(filePath, file.buffer);
    const publicUrl = `${this.baseUrl}/uploads/${key}`;

    this.logger.log(`[LocalStorageProvider] Uploaded file locally: ${publicUrl}`);

    return {
      url: publicUrl,
      key,
      filename: uniqueFilename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, key);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err) {
      this.logger.error(`[LocalStorageProvider] Error deleting file key ${key}:`, err);
      return false;
    }
  }

  async getPublicUrl(key: string): Promise<string> {
    return `${this.baseUrl}/uploads/${key}`;
  }

  private getExtensionFromMime(mime: string): string {
    if (mime.includes('jpeg') || mime.includes('jpg')) return '.jpg';
    if (mime.includes('png')) return '.png';
    if (mime.includes('webp')) return '.webp';
    if (mime.includes('gif')) return '.gif';
    if (mime.includes('avif')) return '.avif';
    return '.bin';
  }
}
