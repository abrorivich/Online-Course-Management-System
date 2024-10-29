import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { User } from 'src/user/entities/user.entity';
import { Course } from 'src/course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Result, Assignment, User, Course])],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService]
})
export class ResultsModule {}
