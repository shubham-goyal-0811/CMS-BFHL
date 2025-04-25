import { Injectable, BadRequestException,InternalServerErrorException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ForgotPasswordDto } from './dto/forgotpassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    
  ) {}

  async login(loginDto: LoginDto, res : Response): Promise<string> {
    
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);// Checking by email and mobile
    

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("bahar aya bcrypt vale se")
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign({ userId: user._id, role : user.role },{ 
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN!
    } );
    
    // Set the token in cookies
    res.cookie('access_token', token, {
      httpOnly: true, // Prevent JavaScript access
      secure: true, // Set to true in production to use https
      maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
    });
    
    return token;
    
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) : Promise <String> {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmailOrMobile(email, email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const token = this.jwtService.sign({ userId: user._id }, { secret: process.env.JWT_SECRET, expiresIn: '1h' });
    const resetLink = `${process.env.ORIGIN}/auth/reset-password/${token}`;

    await this.sendEmail(
      user.email,
      resetLink
    );

    return "RESET PASSWORD LINK SENT TO YOUR EMAIL"
  }

  private async sendEmail(email: string, link : string): Promise<void>{
    const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS,
          },
        });
    
        const mailOptions = {
          from: `"Catalogue App" <${process.env.SMTP_EMAIL}>`,
          to: email,
          subject: 'Reset Password',
          text: `click on this link to reset your password: ${link}`,
        };
    
        try {
          await transporter.sendMail(mailOptions);
        } catch (error) {
          console.error('Failed to send OTP email:', error);
          throw new InternalServerErrorException('Failed to send OTP email');
        }
  }
  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    const decoded: any = this.jwtService.verify(token,{
      secret: process.env.JWT_SECRET,
    });

    if (!decoded) {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = await this.usersService.findById(decoded.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);
    user.password = hashedPassword;
    await user.save();
  }

  async logout(res : Response):Promise <void>{
    try {
      res.clearCookie('access_token');
      
    } catch (error) {
      console.error(error);

    } 
  }
}
