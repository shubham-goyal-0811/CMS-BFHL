import { IsNotEmpty, IsEmail } from "class-validator";

export class LoginDto {

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  password: string;
}
