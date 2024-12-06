import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('should successfully register a new user', async () => {
      const userData: Partial<User> = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const expectedResult = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      };

      jest.spyOn(authService, 'signup').mockResolvedValue(expectedResult as any);

      // @ts-ignore
      const result = await authController.signup(userData);
      
      expect(result).toEqual(expectedResult);
      expect(authService.signup).toHaveBeenCalledWith(userData);
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      const expectedResult = {
        access_token: 'mock_jwt_token',
        user: {
          id: '1',
          email: 'test@example.com'
        }
      };

      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult as any);

      const result = await authController.login(loginDto);
      
      expect(result).toEqual(expectedResult);
      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });
  });
});