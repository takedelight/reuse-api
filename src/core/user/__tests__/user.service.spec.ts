import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { S3StorageService } from 'src/infrastructure/storage/s3-storage.service';
import { UserModel } from '../domain/user.model';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../domain/user.repository.interface';
import { InMemoryUserRepository } from '../infrastructure/repository/in-memory.user.repository';
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useClass: InMemoryUserRepository,
        },
        {
          provide: S3StorageService,
          useValue: {
            deleteFile: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<InMemoryUserRepository>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an empty array when no users exist', async () => {
      const users = await service.getAllUsers();
      expect(users).toEqual([]);
    });

    it('should return all users', async () => {
      const user = new UserModel(
        'id',
        'user1',
        'This is a mock bio',
        'user1@example.com',
        'password123',
        null,
        'user',
        null,
        null,
        new Date(),
      );

      await repository.createUser(user);

      const users = await service.getAllUsers();
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe('user1');
    });
  });

  describe('getUserById', () => {
    it('should return a user if they exist', async () => {
      const newUser = new UserModel(
        'id',
        'user1',
        null,
        'john@example.com',
        'password123',
        null,
        'user',
        null,
        null,
        new Date(),
      );

      const created = await repository.createUser(newUser);

      const user = await service.getUserById(created.id);
      expect(user).toBeDefined();
      expect(user?.email).toBe('john@example.com');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      await expect(service.getUserById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
