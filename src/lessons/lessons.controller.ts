import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Lesson } from './entities/lesson.entity';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post("create")
  create(@Body() createLessonDto: CreateLessonDto): Promise<Lesson> {
    return this.lessonsService.create(createLessonDto);
  }

  @Get("getAll")
  findAll(): Promise<Lesson[]> {
    return this.lessonsService.findAll();
  }

  @Get('getById/:id')
  findOne(@Param('id') id: number): Promise<Lesson> {
    return this.lessonsService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateLessonDto: UpdateLessonDto): Promise<string> {
    return this.lessonsService.update(+id, updateLessonDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number): Promise<string> {
    return this.lessonsService.remove(+id);
  }
}
