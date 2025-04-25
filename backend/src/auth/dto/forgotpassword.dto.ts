import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
  
  @IsEmail()
  @IsNotEmpty()
  email: string; // Email to send the reset password link to
}