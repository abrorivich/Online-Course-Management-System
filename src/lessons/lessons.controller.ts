import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Lesson } from './entities/lesson.entity';
import { RolesAdminGuard } from 'src/auth/rolesAdmin.guard';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  // admin token beradi
  @UseGuards(AuthGuard, RolesAdminGuard)
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
  
  // admin token beradi
  @UseGuards(AuthGuard, RolesAdminGuard)
  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateLessonDto: UpdateLessonDto): Promise<string> {
    return this.lessonsService.update(+id, updateLessonDto);
  }
  
  // admin token beradi
  @UseGuards(AuthGuard, RolesAdminGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: number): Promise<string> {
    return this.lessonsService.remove(+id);
  }
}
