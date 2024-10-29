import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Course } from './entities/course.entity';
import { RolesAdminGuard } from 'src/auth/rolesAdmin.guard';
import { RolesUserGuard } from 'src/auth/roleUser.guard';
import { userWriteToCourseDto } from './dto/userWriteToCourse.Dto';

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

  @UseGuards(AuthGuard, RolesUserGuard)
  @Post("userWriteToCourse/:id")
  userWriteToCourse(@Headers('authorization') authorizationHeader: string, @Param('id') id: number, @Body() userWriteToCourseDto: userWriteToCourseDto,): Promise<Course> {
    const tokens = authorizationHeader.split(' ');
    const accessToken = tokens[1];
    return this.courseService.userWriteToCourse(accessToken, +id, userWriteToCourseDto.userId);
  }
}
