import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { IStorageService } from 'src/common/interfaces/storage.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3StorageService implements IStorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      endpoint: this.configService.getOrThrow<string>('STORAGE_ENDPOINT'),
      region: this.configService.getOrThrow<string>('STORAGE_REGION'),
      credentials: {
        accessKeyId:
          this.configService.getOrThrow<string>('STORAGE_ACCESS_KEY'),
        secretAccessKey:
          this.configService.getOrThrow<string>('STORAGE_SECRET_KEY'),
      },
      forcePathStyle: true,
    });
    this.bucketName = this.configService.getOrThrow<string>(
      'STORAGE_BUCKET_NAME',
    );
  }

  async getUploadUrl(
    folder: string,
    originalName: string,
    contentType: string,
  ) {
    const fileExtension = extname(originalName);
    const key = folder
      ? `${folder}/${uuidv4()}${fileExtension}`
      : `${uuidv4()}${fileExtension}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 900,
      });

      return { url, key };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      throw new InternalServerErrorException(
        `Не вдалося згенерувати посилання для завантаження: ${message}`,
      );
    }
  }

  async getDownloadUrl(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        `Не вдалося згенерувати посилання для перегляду: ${msg}`,
      );
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'NoSuchKey') {
        throw new InternalServerErrorException(
          `Не вдалося видалити файл: ${error.message}`,
        );
      }
    }
  }
}
