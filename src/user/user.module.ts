import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { Result } from 'src/results/entities/result.entity';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, Result])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UserModule { }
