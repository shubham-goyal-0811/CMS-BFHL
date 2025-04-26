import { Body, Controller, Post, Param,Response, BadRequestException, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgotpassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Response() res
  ){
    try {
      const token = await this.authService.login(loginDto,res);
      
      return res.status(HttpStatus.OK).json({ message: 'LOG IN SUCCESS' });
    } catch (error) {
      return res.status(500).json({ message: 'LOGIN FAILED' });
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return { message: 'Password reset email sent' };
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    await this.authService.resetPassword(token, resetPasswordDto);
    return { message: 'Password reset successfully' };
  }
  
  
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Response() res
  ){
    await this.authService.logout(res);
    return res.status(200).json({message : "Logout Success"});
  }
  
}
