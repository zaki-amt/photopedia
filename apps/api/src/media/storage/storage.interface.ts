export interface StorageFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface StorageUploadResult {
  url: string;
  key: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface IStorageProvider {
  uploadFile(file: StorageFile, destinationFolder?: string): Promise<StorageUploadResult>;
  deleteFile(key: string): Promise<boolean>;
  getPublicUrl(key: string): Promise<string>;
}

export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';
