// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly fullName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @Length(6, 20)
  readonly password: string;

  @IsNotEmpty()
  @Length(10, 15)
  readonly mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  readonly address: string;
}
