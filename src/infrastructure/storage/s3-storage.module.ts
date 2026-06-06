import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IStorageService } from '../../common/interfaces/storage.interface';
import { S3StorageService } from './s3-storage.service';
import { storageConfig } from './storage.config';

@Module({
  imports: [ConfigModule.forFeature(storageConfig)],
  providers: [
    {
      provide: IStorageService,
      useClass: S3StorageService,
    },
  ],
  exports: [IStorageService],
})
export class StorageModule {}
