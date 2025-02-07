
// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcryptjs';
// import {
//   BadRequestException,
//   ConflictException,
//   NotFoundException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';

// describe('AuthService', () => {
//   let authService: AuthService;
//   let userRepository: Repository<User>;
//   let jwtService: JwtService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         {
//           provide: getRepositoryToken(User),
//           useValue: {
//             findOne: jest.fn(),
//             create: jest.fn(),
//             save: jest.fn(),
//           },
//         },
//         {
//           provide: JwtService,
//           useValue: {
//             signAsync: jest.fn().mockResolvedValue('mocked_token'),
//           },
//         },
//       ],
//     }).compile();

//     authService = module.get<AuthService>(AuthService);
//     userRepository = module.get<Repository<User>>(getRepositoryToken(User));
//     jwtService = module.get<JwtService>(JwtService);
//   });

//   describe('signup', () => {
//     const signupDto = {
//       email: 'test@docquity.com',
//       username: 'testuser',
//       firstname: 'amrit',
//       lastname: 'Gupta',
//       country_code: '+91',
//       mobile_number: '9717211389',
//       password: 'password123',
//     };

//     it('should register a user successfully', async () => {
//       jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
//       jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');
//       jest.spyOn(userRepository, 'create').mockReturnValue({
//         ...signupDto,
//         password: 'hashedPassword',
//       } as any);
//       jest.spyOn(userRepository, 'save').mockResolvedValue({
//         ...signupDto,
//         password: 'hashedPassword',
//       } as any);

//       const result = await authService.signup(signupDto);

//       expect(result).toEqual({ message: 'User Registered Successfully' });
//       expect(userRepository.create).toHaveBeenCalledTimes(1);
//       expect(userRepository.save).toHaveBeenCalledTimes(1);
//     });

//     it('should throw ConflictException if email exists', async () => {
//       jest.spyOn(userRepository, 'findOne').mockResolvedValue({ id: 1 } as User);

//       await expect(authService.signup(signupDto)).rejects.toThrow(ConflictException);
//     });

//     it('should throw ConflictException if username exists', async () => {
//       jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null); // No user found by email
//       jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({ id: 1 } as User); // Username exists

//       await expect(authService.signup(signupDto)).rejects.toThrow(ConflictException);
//     });
//   });

//   describe('login', () => {
//     const loginDto = {
//       email: 'test@docquity.com',
//       password: 'password123',
//     };

//     it('should return user not found', async () => {
//       jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

//       await expect(authService.login(loginDto)).rejects.toThrow(NotFoundException);
//     });

//     it('should return invalid credentials', async () => {
//       jest.spyOn(userRepository, 'findOne').mockResolvedValue({
//         id: 1,
//         password: 'hashed_password',
//       } as User);

//       jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

//       await expect(authService.login(loginDto)).rejects.toThrow(BadRequestException);
//     });

//     it('should login user successfully', async () => {
//       jest.spyOn(userRepository, 'findOne').mockResolvedValue({
//         id: 1,
//         password: await bcrypt.hash('password123', 10),
//         username: 'testuser',
//         email: 'test@docquity.com',
//       } as User);

//       jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

//       jest.spyOn(jwtService, 'signAsync').mockResolvedValue('abcd.efgh.ijkl');

//       const result = await authService.login(loginDto);

//       expect(result).toEqual({
//         message: 'Logged in Sucssfully',
//         access_token: 'abcd.efgh.ijkl',
//       });
//     });
//   });

  
// });


import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUsers: User[] = [
    {
      id: 1,
      firstname: 'Dhruv',
      lastname: 'Wazir',
      username: 'dhruvw',
      email: 'dhurv.wazir@example.com',
      mobile_number: '1234567890',
      password: 'hashedpassword',
      country_code: '+91',
    },
    {
      id: 2,
      firstname: 'Jane',
      lastname: 'Smith',
      username: 'janesmith',
      email: 'jane.smith@example.com',
      mobile_number: '0987654321',
      password: 'hashedpassword',
      country_code: '+91',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn().mockResolvedValue(mockUsers),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mocked_token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    const signupDto = {
      email: 'test@docquity.com',
      username: 'testuser',
      firstname: 'dhruv',
      lastname: 'wazir',
      country_code: '+91',
      mobile_number: '9717211389',
      password: 'password123',
    };

    it('should register a user successfully', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');
      jest.spyOn(userRepository, 'create').mockReturnValue({
        ...signupDto,
        password: 'hashedPassword',
      } as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...signupDto,
        password: 'hashedPassword',
      } as any);

      const result = await authService.signup(signupDto);

      expect(result).toEqual({ message: 'User Registered Successfully' });
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException if email exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({ id: 1 } as User);

      await expect(authService.signup(signupDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if username exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null); // No user found by email
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({ id: 1 } as User); // Username exists

      await expect(authService.signup(signupDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@docquity.com',
      password: 'password123',
    };

    it('should return user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(NotFoundException);
    });

    it('should return invalid credentials', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        id: 1,
        password: 'hashed_password',
      } as User);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(BadRequestException);
    });

    it('should login user successfully', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        id: 1,
        password: await bcrypt.hash('password123', 10),
        username: 'testuser',
        email: 'test@docquity.com',
      } as User);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('abcd.efgh.ijkl');

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        message: 'Logged in Sucssfully',
        access_token: 'abcd.efgh.ijkl',
      });
    });
  });

  describe('getTable', () => {
    it('should return an array of users with selected fields', async () => {
      const result = await authService.getTable();

      expect(result).toEqual(mockUsers);
      expect(userRepository.find).toHaveBeenCalledWith({
        select: ['id', 'firstname', 'lastname', 'username', 'email', 'mobile_number'],
      });
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no users are found', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([]);

      const result = await authService.getTable();

      expect(result).toEqual([]);
      expect(userRepository.find).toHaveBeenCalledWith({
        select: ['id', 'firstname', 'lastname', 'username', 'email', 'mobile_number'],
      });
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});

