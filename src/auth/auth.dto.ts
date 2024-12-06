import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
    
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;
  
    @ApiProperty({ example: 'password123' })
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    password: string;
  
    @ApiProperty({ example: 'John', required: false })
    @IsString({ message: 'First name must be a string' })
    firstName: string;
  
    @ApiProperty({ example: 'Doe', required: false })
    @IsString({ message: 'Last name must be a string' })
    lastName: string;
  }

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
