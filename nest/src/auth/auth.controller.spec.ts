
// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { SignupDto } from './dto/signup.dto';
// import { LoginDto } from './dto/login.dto';
// import { User } from './entities/user.entity';
// import { AuthGuard } from '../guard/auth/auth.guard'; 
// import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { getRepositoryToken } from '@nestjs/typeorm';

// jest.mock('../guard/auth/auth.guard', () => ({ AuthGuard: jest.fn().mockImplementation(() => true) }));

// describe('AuthController', () => {
//   let authController: AuthController;
//   let authService: AuthService;

//   const mockAuthService = {
//     signup: jest.fn(),
//     login: jest.fn(),
//     getTable: jest.fn(),
//   };

//   const mockUsers: User[] = [
//     {
//       id: 1,
//       firstname: 'John',
//       lastname: 'Doe',
//       username: 'johndoe',
//       email: 'john.doe@example.com',
//       mobile_number: '1234567890',
//       password: 'hashedpassword',
//       country_code: '+91',
//     },
//     {
//       id: 2,
//       firstname: 'Jane',
//       lastname: 'Smith',
//       username: 'janesmith',
//       email: 'jane.smith@example.com',
//       mobile_number: '0987654321',
//       password: 'hashedpassword',
//       country_code: '+91',  
//     },
//   ];

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AuthController],
//       providers: [
//         {
//           provide: AuthService,
//           useValue: mockAuthService,
//         },
//         {
//           provide: getRepositoryToken(User),
//           useValue: {},
//         },
//         JwtService,
//       ],
//     }).compile();

//     authController = module.get<AuthController>(AuthController);
//     authService = module.get<AuthService>(AuthService);
//   });


//   describe('signup', () => {
//     it('should register a user successfully', async () => {
//       const signupDto: SignupDto = {
//         email: 'test@docquity.com',
//         username: 'testuser',
//         firstname: 'amrit',
//         lastname: 'Gupta',
//         country_code: '+91',
//         mobile_number: '9717211389',
//         password: 'password123',
//       };

//       jest.spyOn(authService, 'signup').mockResolvedValue({ message: 'User Registered Successfully' });

//       const result = await authController.signup(signupDto);

//       expect(result).toEqual({ message: 'User Registered Successfully' });
//       expect(authService.signup).toHaveBeenCalledWith(signupDto);
//     });

//     it('should throw ConflictException when email or username already exists', async () => {
//       jest.spyOn(authService, 'signup').mockRejectedValue(new ConflictException('Email already exists'));

//       await expect(authController.signup({} as SignupDto)).rejects.toThrow(ConflictException);
//     });
//   });

//   describe('login', () => {
//     it('should login user successfully and return access token', async () => {
//       const loginDto: LoginDto = {
//         email: 'test@docquity.com',
//         password: 'password123',
//       };

//       jest.spyOn(authService, 'login').mockResolvedValue({
//         message: 'Logged in Successfully',
//         access_token: 'abcd.efgh.ijkl',
//       });

//       const result = await authController.login(loginDto);

//       expect(result).toEqual({
//         message: 'Logged in Successfully',
//         access_token: 'abcd.efgh.ijkl',
//       });
//       expect(authService.login).toHaveBeenCalledWith(loginDto);
//     });

//     it('should throw NotFoundException if user not found', async () => {
//       jest.spyOn(authService, 'login').mockRejectedValue(new NotFoundException('User not found'));

//       await expect(authController.login({} as LoginDto)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('dashboard', () => {
//     it('should return an array of users with selected fields', async () => {
//       jest.spyOn(authService, 'getTable').mockResolvedValue(mockUsers);

//       const result = await authController.dashboard();

//       expect(result).toEqual(mockUsers);
//       expect(authService.getTable).toHaveBeenCalledTimes(1);
//     });

//     it('should return an empty array if no users are found', async () => {
//       jest.spyOn(authService, 'getTable').mockResolvedValue([]);

//       const result = await authController.dashboard();

//       expect(result).toEqual([]);
//       expect(authService.getTable).toHaveBeenCalledTimes(1);
//     });
//   });
// });



import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '../guard/auth/auth.guard'; // Import your AuthGuard

describe('AuthController', () => {
  
  let app: INestApplication;
  let authService = { signup: jest.fn(), login: jest.fn() };
  let jwtService = { sign: jest.fn(), verifyAsync: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: JwtService, useValue: jwtService },
        AuthGuard, // Register AuthGuard
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue(new AuthGuard(jwtService as any)) // Use the mocked JwtService in AuthGuard
    .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/signup', () => {
    it('should register user successfully', async () => {
      const signupDto = {
        email: 'test@docquity.com',
        username: 'testuser',
        firstname: 'Amrit',
        lastname: 'Gupta',
        country_code: '+91',
        mobile_number: '9717211389',
        password: 'password123',
      };
      authService.signup.mockResolvedValue({
        message: 'User Registered Successfully',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(201);

      expect(response.body).toEqual({
        message: 'User Registered Successfully',
      });
    });

    it('should return 409 if email already exists', async () => {
      const signupDto = {
        email: 'existing@docquity.com',
        username: 'testuser',
        firstname: 'Amrit',
        lastname: 'Gupta',
        country_code: '+91',
        mobile_number: '9717211389',
        password: 'password123',
      };

      authService.signup.mockRejectedValue(new ConflictException('Conflict'));

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(409);

      expect(response.body.message).toBe('Conflict');
    });
  });

  describe('POST /auth/login', () => {
    it('should login user successfully', async () => {
      const loginDto = {
        email: 'test@docquity.com',
        password: 'password123',
      };

      authService.login.mockResolvedValue({
        message: 'User Login Successfully',
        access_token: 'mocked_token',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201);

      expect(response.body).toEqual({
        message: 'User Login Successfully',
        access_token: 'mocked_token',
      });
    });

    it('should return 401 for invalid credentials', async () => {
      const loginDto = {
        email: 'test@docquity.com',
        password: 'wrongpassword',
      };

      authService.login.mockRejectedValue(new UnauthorizedException('Unauthorized'));

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toBe('Unauthorized');
    });
  });

  // describe('GET /auth/validate-token', () => {
  //   it('should return 200 if token is valid', async () => {
  //     const validToken = 'valid.token.here';

  //     jwtService.verifyAsync.mockResolvedValue({ userId: 1 });

  //     const response = await request(app.getHttpServer())
  //       .get('/auth/validate-token')
  //       .set('Authorization', `Bearer ${validToken}`)
  //       .expect(200);

  //     expect(response.body).toEqual({ message: 'Token is valid' });
  //   });

  //   it('should return 401 if token is invalid', async () => {
  //     const invalidToken = 'invalid.token.here';

  //     jwtService.verifyAsync.mockRejectedValue(new UnauthorizedException('Invalid token'));

  //     const response = await request(app.getHttpServer())
  //       .get('/auth/validate-token')
  //       .set('Authorization', `Bearer ${invalidToken}`)
  //       .expect(404);

  //     expect(response.body.message).toBe('Invalid token');
  //   });
  // });
  
});