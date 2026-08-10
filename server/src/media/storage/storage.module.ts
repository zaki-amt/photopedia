import { Module, Global } from '@nestjs/common';
import { STORAGE_PROVIDER } from './storage.interface';
import { LocalStorageProvider } from './local.storage';
import { R2StorageProvider } from './r2.storage';
import { S3StorageProvider } from './s3.storage';
import { SpacesStorageProvider } from './spaces.storage';

@Global()
@Module({
  providers: [
    LocalStorageProvider,
    R2StorageProvider,
    S3StorageProvider,
    SpacesStorageProvider,
    {
      provide: STORAGE_PROVIDER,
      useFactory: (
        localStorage: LocalStorageProvider,
        r2Storage: R2StorageProvider,
        s3Storage: S3StorageProvider,
        spacesStorage: SpacesStorageProvider,
      ) => {
        const driver = (process.env.STORAGE_DRIVER || 'local').toLowerCase();
        switch (driver) {
          case 'r2':
            return r2Storage;
          case 's3':
            return s3Storage;
          case 'spaces':
            return spacesStorage;
          case 'local':
          default:
            return localStorage;
        }
      },
      inject: [LocalStorageProvider, R2StorageProvider, S3StorageProvider, SpacesStorageProvider],
    },
  ],
  exports: [STORAGE_PROVIDER, LocalStorageProvider, R2StorageProvider, S3StorageProvider, SpacesStorageProvider],
})
export class StorageModule {}
