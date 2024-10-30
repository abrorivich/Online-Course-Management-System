import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers, Query, UnauthorizedException } from '@nestjs/common';
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

  // create (course create qiladi admin token berish kerak )
  @UseGuards(AuthGuard, RolesAdminGuard)
  @Post("create")
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseService.create(createCourseDto);
  }

  @Get("getAll")
  findAll(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @Get("getAllCourse")
  findAllCourse(): Promise<Course[]> {
    return this.courseService.findAllCourse();
  }

  // search (name masalan NodeJS yozilgan bosa N kiritsa qaytaradi n kiritsa qaytarmidi)
  @Get('search')
  async search(@Query('name') name: string): Promise<Course[]> {
    return this.courseService.searchCourses(name);
  }

  @Get('getById/:id')
  findOne(@Param('id') id: number): Promise<Course> {
    return this.courseService.findOne(+id);
  }

  // admin token beradi
  @UseGuards(AuthGuard, RolesAdminGuard)
  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto): Promise<string> {
    return this.courseService.update(+id, updateCourseDto);
  }
  
  // admin token beradi
  @UseGuards(AuthGuard, RolesAdminGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: number): Promise<string> {
    return this.courseService.remove(+id);
  }

// potpiska bosish 
  @UseGuards(AuthGuard, RolesUserGuard)
  @Post("userWriteToCourse/:id")
  userWriteToCourse(@Headers('authorization') authorizationHeader: string, @Param('id') id: number, @Body() userWriteToCourseDto: userWriteToCourseDto,) {
    const tokens = authorizationHeader.split(' ');
    const accessToken = tokens[1];
    return this.courseService.userWriteToCourse(accessToken, +id, userWriteToCourseDto.userId);
  }

  // getAllForUser (user token beradi va course larini chiqazib beradi)
  @UseGuards(AuthGuard, RolesUserGuard)
  @Get("getAllForUser")
  async getAllForUser(@Headers('authorization') authorizationHeader: string): Promise<Course[]> {
    const tokens = authorizationHeader.split(' ');
    const accessToken = tokens[1];
    if (!accessToken) {
      throw new UnauthorizedException('Access token is missing');
    }
    return this.courseService.getAllForUser(accessToken);
  }

  // getAllBall (user token beradi va ballarini hisoblab beradi)
  @UseGuards(AuthGuard, RolesUserGuard)
  @Get("getAllBall")
  async getAllBall(@Headers('authorization') authorizationHeader: string): Promise<Course[]> {
    const tokens = authorizationHeader.split(' ');
    const accessToken = tokens[1];
    if (!accessToken) {
      throw new UnauthorizedException('Access token is missing');
    }
    return this.courseService.getAllBall(accessToken);
  }
}
