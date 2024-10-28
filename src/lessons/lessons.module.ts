import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Modules } from 'src/modules/entities/module.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Modules, Assignment])],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],

})
export class LessonsModule { }
