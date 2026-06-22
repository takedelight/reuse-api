import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { S3StorageService } from 'src/infrastructure/storage/s3-storage.service';
import { UserService } from './app/user.service';
import { USER_REPOSITORY_TOKEN } from './domain/interfaces/user.repository.interface';
import { UserRepository } from './infrastructure/repository/user.repository';
import { UserController } from './presentation/user.controller';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    { provide: USER_REPOSITORY_TOKEN, useClass: UserRepository },
    S3StorageService,
  ],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UserModule {}
