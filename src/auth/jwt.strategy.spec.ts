import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockPayload = {
    sub: '1',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should successfully validate a user', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await jwtStrategy.validate(mockPayload);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: mockPayload.sub } 
      });
      expect(result).toEqual(expect.objectContaining({
        id: user.id,
        email: user.email,
      }));
      expect(result).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(jwtStrategy.validate(mockPayload))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});