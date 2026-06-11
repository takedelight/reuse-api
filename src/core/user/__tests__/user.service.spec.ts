// import { ConflictException, NotFoundException } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { USER_REPOSITORY_TOKEN } from '../domain/user.repository.interface';
// import { CreateUserDto } from '../dto/create-user.dto';
// import { UpdateUserDto } from '../dto/update-user.dto';
// import { InMemoryUserRepository } from '../infrastructure/repository/in-memory.user.repository';
// import { UserService } from '../user.service';

// describe('UserService', () => {
//   let service: UserService;
//   let repository: InMemoryUserRepository;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: USER_REPOSITORY_TOKEN,
//           useClass: InMemoryUserRepository,
//         },
//       ],
//     }).compile();

//     service = module.get<UserService>(UserService);
//     repository = module.get<InMemoryUserRepository>(USER_REPOSITORY_TOKEN);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('getAllUsers', () => {
//     it('should return an empty array when no users exist', async () => {
//       const users = await service.getAllUsers();
//       expect(users).toEqual([]);
//     });

//     it('should return all users', async () => {
//       await repository.createUser({
//         username: 'user1',
//         email: 'user1@example.com',
//         password: 'password123',
//       });

//       const users = await service.getAllUsers();
//       expect(users).toHaveLength(1);
//       expect(users[0].username).toBe('user1');
//     });
//   });

//   describe('getUserById', () => {
//     it('should return a user if they exist', async () => {
//       const created = await repository.createUser({
//         username: 'john',
//         email: 'john@example.com',
//         password: 'password123',
//       });

//       const user = await service.getUserById(created.id);
//       expect(user).toBeDefined();
//       expect(user?.email).toBe('john@example.com');
//     });

//     it('should throw NotFoundException if user does not exist', async () => {
//       await expect(service.getUserById('non-existent-id')).rejects.toThrow(
//         NotFoundException,
//       );
//     });
//   });

//   describe('createUser', () => {
//     const dto: CreateUserDto = {
//       username: 'newuser',
//       email: 'new@example.com',
//       password: 'password123',
//     };

//     it('should successfully create a user', async () => {
//       const result = await service.createUser(dto);
//       expect(result).toBeDefined();
//       expect(result.email).toBe(dto.email);
//     });

//     it('should throw ConflictException if email is already taken', async () => {
//       await service.createUser(dto);
//       await expect(service.createUser(dto)).rejects.toThrow(ConflictException);
//     });
//   });

//   describe('updateUser', () => {
//     it('should successfully update user data', async () => {
//       const created = await repository.createUser({
//         username: 'oldname',
//         email: 'update@example.com',
//         password: 'password123',
//       });

//       const updateDto: UpdateUserDto = { username: 'newname' };
//       const result = await service.updateUser(created.id, updateDto);

//       expect(result.username).toBe('newname');
//     });

//     it('should throw NotFoundException when trying to update non-existent user', async () => {
//       const updateDto: UpdateUserDto = { username: 'newname' };
//       await expect(
//         service.updateUser('non-existent-id', updateDto),
//       ).rejects.toThrow(NotFoundException);
//     });
//   });
// });
