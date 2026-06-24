import { Test, TestingModule } from '@nestjs/testing';
import { S3StorageService } from 'src/infrastructure/storage/s3-storage.service';
import { UserService } from '../app/user.service';
import { USER_REPOSITORY_TOKEN } from '../domain/interfaces/user.repository.interface';
import { UserModel } from '../domain/models/user.model';
import { InMemoryUserRepository } from '../infrastructure/repository/in-memory.user.repository';
import { UserController } from '../presentation/user.controller';

describe('UserController', () => {
  let controller: UserController;
  let repository: InMemoryUserRepository;

  const createMockUser = (id = 'id', username = 'user1') => {
    return new UserModel(
      id,
      username,
      'This is a mock bio',
      `${username}@example.com`,
      'password123',
      null,
      'user',
      null,
      null,
      new Date(),
    );
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
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

    controller = module.get<UserController>(UserController);
    repository = module.get<InMemoryUserRepository>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const user = createMockUser('id', 'user1');
      await repository.createUser(user);

      const result = await controller.getAllUsers();
      expect(result).toHaveLength(1);
      expect(result[0].username).toBe('user1');
    });

    it('should return an empty array if no users exist', async () => {
      const result = await controller.getAllUsers();
      expect(result).toEqual([]);
    });
  });
});
