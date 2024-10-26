import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Modules } from 'src/modules/entities/module.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Modules, User])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
