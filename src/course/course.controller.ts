import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Course } from './entities/course.entity';
import { RolesAdminGuard } from 'src/auth/rolesAdmin.guard';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @UseGuards(AuthGuard, RolesAdminGuard)
  @Post("create")
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseService.create(createCourseDto);
  }

  @Get("getAll")
  findAll(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @Get('getById/:id')
  findOne(@Param('id') id: number): Promise<Course> {
    return this.courseService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesAdminGuard)
  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto): Promise<string> {
    return this.courseService.update(+id, updateCourseDto);
  }

  @UseGuards(AuthGuard, RolesAdminGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: number): Promise<string> {
    return this.courseService.remove(+id);
  }
}
