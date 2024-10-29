import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = await this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    const course = await this.courseRepository.find({ relations: ['module', "module.lesson", "module.lesson.assignment", "module.lesson.assignment.result", "module.lesson.assignment.result.user", "user"] })
    return course
  }

  async findOne(id: number): Promise<Course> {
    let course = await this.courseRepository.findOne({
      where: { id },
      relations: ['module'],
    })
    if (!course)
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<string> {
    let coruse = await this.courseRepository.findOneBy({ id })
    if (!coruse) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    await this.courseRepository.update({ id }, { ...updateCourseDto });
    return `Updated course 👌🏻`
  }

  async remove(id: number): Promise<string> {
    let course = await this.courseRepository.findOneBy({ id })
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    await this.courseRepository.delete(id);
    return "Deleted 🛒"
  }

  async userWriteToCourse(accessToken: string, courseId: number, userId: number) {
    try {
      const payload = this.jwtService.verify(accessToken);
      const users = await this.userRepository.findOne({ where: { id: payload.id } });
      if (!users) {
        throw new UnauthorizedException('User not found');
      }
      const course = await this.courseRepository.findOne({ where: { id: courseId }, relations: ['user']})
      if (!course)
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    if (!course.user.some(existingUser => existingUser.id === users.id)) {
      course.user.push(users);
    } else {
      throw new HttpException('User already in course', HttpStatus.BAD_REQUEST);
    }
    await this.courseRepository.save(course); 
    return course;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
