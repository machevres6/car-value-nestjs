import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {

    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1, 
            email, 
            password: 'asdf'
          } as User
        ]);
      },
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User)
      },
      // update: () => {},
      // remove: () => {},

    }

    fakeAuthService = {
      // signup: (email: string, password: string) => {
      //   const user = { id: Math.floor(Math.random() * 999999), email, password } as User;
      //   users.push(user);
      //   return Promise.resolve(user);
      // },
      // signin: (email: string, password: string) => {
      //   const filteredUsers = users.filter(user => user.email === email);
      //   if (filteredUsers.length === 0) {
      //     throw new Error('User not found');
      //   }
      //   const user = filteredUsers[0];
      //   if (user.password !== password) {
      //     throw new Error('Incorrect password');
      //   }
      //   return Promise.resolve(user);
      // },
    }



    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdf@asdf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  })

  it('findUser throws an error is user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  })
});
