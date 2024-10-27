import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv'
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
dotenv.config()

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1d' }
    }),
    UserModule
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
