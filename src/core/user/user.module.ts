import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPOSITORY_TOKEN } from './domain/user.repository.interface';
import { UserEntity } from './infrastructure/entity/user.entity';
import { UserRepository } from './infrastructure/repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserService,
    { provide: USER_REPOSITORY_TOKEN, useClass: UserRepository },
  ],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UserModule {}
