import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) { }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = await this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    const course = await this.courseRepository.find({ relations: ['module', "module.lesson", "module.lesson.assignment"] })
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
}
