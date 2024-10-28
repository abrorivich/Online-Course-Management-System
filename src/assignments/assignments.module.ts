import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Assignment } from './entities/assignment.entity';
import { Result } from 'src/results/entities/result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Lesson, Result])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule { }
