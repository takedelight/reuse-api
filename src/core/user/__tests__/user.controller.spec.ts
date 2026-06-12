// import { NotFoundException } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { USER_REPOSITORY_TOKEN } from '../domain/user.repository.interface';
// import { UpdateUserDto } from '../dto/update-user.dto';
// import { InMemoryUserRepository } from '../infrastructure/repository/in-memory.user.repository';
// import { UserController } from '../user.controller';
// import { UserService } from '../user.service';
//
// describe('UserController', () => {
//   let controller: UserController;
//   let repository: InMemoryUserRepository;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [
//         UserService,
//         {
//           provide: USER_REPOSITORY_TOKEN,
//           useClass: InMemoryUserRepository,
//         },
//       ],
//     }).compile();
//
//     controller = module.get<UserController>(UserController);
//     repository = module.get<InMemoryUserRepository>(USER_REPOSITORY_TOKEN);
//   });
//
//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
//
//   describe('getAllUsers', () => {
//     it('should return an array of users', async () => {
//       await repository.createUser({
//         username: 'alex',
//         email: 'alex@example.com',
//         password: 'password123',
//       });
//
//       const result = await controller.getAllUsers();
//       expect(result).toHaveLength(1);
//       expect(result[0].username).toBe('alex');
//     });
//
//     it('should return an empty array if no users exist', async () => {
//       const result = await controller.getAllUsers();
//       expect(result).toEqual([]);
//     });
//   });
//
//   describe('getUserById', () => {
//     it('should return user details by id', async () => {
//       const created = await repository.createUser({
//         username: 'alex',
//         email: 'alex@example.com',
//         password: 'password123',
//       });
//
//       const result = await controller.getUserById(created.id);
//       expect(result).toBeDefined();
//       expect(result?.id).toBe(created.id);
//     });
//
//     it('should throw NotFoundException if user not found', async () => {
//       await expect(controller.getUserById('wrong-id')).rejects.toThrow(
//         NotFoundException,
//       );
//     });
//   });
//
//   describe('updateUser', () => {
//     it('should modify and return updated user', async () => {
//       const created = await repository.createUser({
//         username: 'old',
//         email: 'change@example.com',
//         password: 'password123',
//       });
//
//       const updateDto: UpdateUserDto = { username: 'new' };
//       const result = await controller.updateUser(created.id, updateDto);
//
//       expect(result.username).toBe('new');
//     });
//
//     it('should throw NotFoundException on wrong user id update', async () => {
//       const updateDto: UpdateUserDto = { username: 'new' };
//       await expect(
//         controller.updateUser('wrong-id', updateDto),
//       ).rejects.toThrow(NotFoundException);
//     });
//   });
// });
