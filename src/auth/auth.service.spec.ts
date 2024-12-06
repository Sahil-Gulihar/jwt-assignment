import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should successfully register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(userData);
      mockUserRepository.save.mockResolvedValue(userData);

      const result = await authService.signup(userData);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ 
        where: { email: userData.email } 
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        email: userData.email,
        password: expect.any(String), // hashed password
      }));
      expect(result).toEqual(expect.objectContaining({
        email: userData.email,
      }));
    });

    it('should throw ConflictException if user already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockUserRepository.findOne.mockResolvedValue({} as User);

      // @ts-ignore
      await expect(authService.signup(userData)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValue('mock_jwt_token');

      const result = await authService.login('test@example.com', 'password123');

      expect(result).toEqual({
        access_token: 'mock_jwt_token',
        user: expect.objectContaining({
          id: user.id,
          email: user.email,
        }),
      });
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(authService.login('test@example.com', 'password123'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for incorrect password', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('correctpassword', 10),
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(authService.login('test@example.com', 'wrongpassword'))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});