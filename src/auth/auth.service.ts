import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,  // Added for better error handling
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { SignupDto } from './auth.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}


  async generateOAuthToken(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email 
    };
    
    return this.jwtService.signAsync(payload);
  }

  async signup(signupDto: SignupDto): Promise<Partial<User>> {
    const { email, password, firstName, lastName } = signupDto;

    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user object
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName: firstName || '',  // Ensure it has a value
      lastName: lastName || '',    // Ensure it has a value
    });

    // Save the user to the database
    await this.userRepository.save(user);

    // Omit the password from the response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      // Check if the provided password matches the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      // Log error and throw an internal server error
      console.error(error);
      throw new InternalServerErrorException('An error occurred while validating the password');
    }

    // Generate JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
    };

    // Return the JWT access token
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
