import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<{ token: string }> {
    const { email, password, fullName, mobileNumber, address } = createUserDto;

    // 1. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Save user to DB
    const newUser = {
      fullName,
      email,
      password: hashedPassword,
      mobileNumber,
      address,
    };


    // 3. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // 4. Send OTP via email
    await this.sendOtpToEmail(email, otp);

    // 5. Create JWT Token with user + OTP
    const payload = {
      user : newUser,
      otp,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '10m',
    });

    return { token };
  }

  async verifyOtpAndCreateUser(token: string, otp: number): Promise<{ authToken: string }> {
    let decoded: any;

    try {
      // Verify and decode the JWT token
      decoded = this.jwtService.verify(token,{
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Token is expired or invalid');
    }

    // Check if OTP matches
    if (decoded.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Check if user already exists (you can adjust this based on your use case)
    const existingUser = await this.userModel.findOne({ email: decoded.user.email });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // 6. Create user from data in token
    const newUser = new this.userModel({
      fullName: decoded.user.fullName,
      email: decoded.user.email,
      password: decoded.user.password, // already hashed
      mobileNumber: decoded.user.mobileNumber,
      address: decoded.user.address,
    });

    await newUser.save();
    const authToken = this.jwtService.sign(
      { userId: newUser._id, email: newUser.email },
      { 
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN!
      } 
    );
    return { authToken };
  }

  private async sendOtpToEmail(email: string, otp: number): Promise<void> {
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
      subject: 'Your OTP Code',
      text: `Your verification OTP is: ${otp}`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new InternalServerErrorException('Failed to send OTP email');
    }
  }

  async getUser(id : string){
    return await this.userModel.findById(id);
  }

  async findByEmailOrMobile(email: string, mobileNumber: string): Promise<User | null> {
    return this.userModel.findOne({
      $or: [{ email }, { mobileNumber }]
    }).exec();
  }

  async findByEmail(email : string): Promise<User | null> {
    return this.userModel.findOne({
      $or: [{ email }]
    }).exec();
  }
  
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec(); // Use Mongoose's findById
  }
}
