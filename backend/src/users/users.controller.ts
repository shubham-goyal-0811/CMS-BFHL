import { Controller, Post, Body, Res, HttpStatus, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';  // Import Response from express

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // User registration (send OTP)
  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<{ token: string }> {
    const { email, mobileNumber } = createUserDto;

    // Check for duplicate user by email or mobile
    const existingUser = await this.usersService.findByEmailOrMobile(email, mobileNumber);
    if (existingUser) {
      throw new BadRequestException('User with the same email or mobile number already exists.');
    }

    const { token } = await this.usersService.createUser(createUserDto);
    return { token };
  }
  
  // OTP verification and user creation (set token in cookies)
  @Post('verify-otp')
  async verifyOtpAndCreateUser(
    @Body('token') token: string,
    @Body('otp') otp: number,
    @Res() res: Response, // Ensure Response type is used
  ) {
    try {
      // Verify OTP and create the user
      const { authToken } = await this.usersService.verifyOtpAndCreateUser(token, otp);

      // Respond with a success message
      return res.status(HttpStatus.OK).json({ message: 'User registered and logged in successfully' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
