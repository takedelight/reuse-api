import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { USER_REPOSITORY_TOKEN } from './domain/user.repository.interface';
import { UserRepository } from './infrastructure/repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    { provide: USER_REPOSITORY_TOKEN, useClass: UserRepository },
  ],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UserModule {}
