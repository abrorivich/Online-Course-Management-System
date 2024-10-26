import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Modules } from 'src/modules/entities/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Modules])],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
