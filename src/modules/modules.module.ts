import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modules } from './entities/module.entity';
import { Course } from 'src/course/entities/course.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Modules, Course, Lesson])],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule { }
