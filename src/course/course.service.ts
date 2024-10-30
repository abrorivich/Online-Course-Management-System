import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const courseCheck = await this.courseRepository.findOne({ where: { name: createCourseDto.name } })
      if (courseCheck) {
        throw new HttpException('Name already in course', HttpStatus.CONFLICT);
      }
      const course = await this.courseRepository.create(createCourseDto);
      return this.courseRepository.save(course);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Course[]> {
    try {
      const courses = await this.courseRepository.find({
        relations: [
          'module',
          'module.lesson',
          'module.lesson.assignment',
          'module.lesson.assignment.result',
          'module.lesson.assignment.result.user',
          'user'
        ],
      });

      const formattedCourses = courses.map(course => {
        // Har bir kursdagi foydalanuvchilarni formatlash
        course.user.forEach(user => {
          delete user.password;
        });

        // Har bir assignment ichidagi result foydalanuvchisini formatlash
        course.module.forEach(module => {
          module.lesson.forEach(lesson => {
            if (lesson.assignment && lesson.assignment.result) {
              const results = lesson.assignment.result; // Natijalar massivi
              results.forEach(result => {
                if (result.user) {
                  delete result.user.password;
                }
              });
            }
          });
        });
        return course;
      });
      return formattedCourses;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAllCourse(): Promise<Course[]> {
    try {
      const courses = await this.courseRepository.find();
      return courses
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  async searchCourses(nameFilter: string): Promise<Course[]> {
    if (!nameFilter) {
      return this.courseRepository.find(); // Agar filter bo'sh bo'lsa, barcha kurslarni qaytar
    }
    // Boshidan kelishi uchun LIKE shartini o'rnatamiz
    const courses = await this.courseRepository.find({
      where: {
        name: Like(`${nameFilter}%`), // Faqat boshida keladiganlar
      },
    });
    return courses;
  }

  async findOne(id: number): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne({
        where: { id },
        relations: [
          'module',
        ],
      });
      if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }
      return course
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<string> {
    try {
      let coruse = await this.courseRepository.findOneBy({ id })
      if (!coruse) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }
      await this.courseRepository.update({ id }, { ...updateCourseDto });
      return `Updated course 👌🏻`
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number): Promise<string> {
    try {
      let course = await this.courseRepository.findOneBy({ id })
      if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }
      await this.courseRepository.delete(id);
      return "Deleted 🛒"
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async userWriteToCourse(accessToken: string, courseId: number, userId: number) {
    try {
      const payload = this.jwtService.verify(accessToken);
      const users = await this.userRepository.findOne({ where: { id: payload.id } });
      if (!users) {
        throw new UnauthorizedException('User not found');
      }
      const course = await this.courseRepository.findOne({ where: { id: courseId }, relations: ['user'] })
      if (!course)
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      if (!course.user.some(existingUser => existingUser.id === users.id)) {
        course.user.push(users);
      } else {
        throw new HttpException('User already in course', HttpStatus.BAD_REQUEST);
      }
      await this.courseRepository.save(course);

      const sanitizedUsers = course.user.map(({ password, ...rest }) => rest);

        return {
            ...course,
            user: sanitizedUsers, // Yangi foydalanuvchi ro'yxati parolsiz
        };
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async getAllForUser(accessToken: string): Promise<Course[]> {
    try {
      const payload = this.jwtService.verify(accessToken);
      const user = await this.userRepository.findOne({ where: { id: payload.id } });
      if (!user) {
        throw new UnauthorizedException('User not found'); // Foydalanuvchi topilmasa
      }
      const courses = await this.courseRepository.find({ relations: ['user'] });
      const enrolledCourses = courses.filter(course =>
        course.user.some(existingUser => existingUser.id === user.id)
      );

      if (enrolledCourses.length === 0) {
        throw new UnauthorizedException('The user is not enrolled in any course'); // Kursda bo'lmasa
      }
      const coursesWithDetails = await this.courseRepository.find({
        relations: [
          'module',
          'module.lesson',
          'module.lesson.assignment',
        ],
      });
      return coursesWithDetails;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new UnauthorizedException('Invalid access token');
      }
    }
  }

  async getAllBall(accessToken: string): Promise<any[]> { // Natijalar turini o'zgartirdik
    try {
      const payload = this.jwtService.verify(accessToken);
      const user = await this.userRepository.findOne({ where: { id: payload.id } });
      if (!user) {
        throw new UnauthorizedException('User not found'); // Foydalanuvchi topilmasa
      }

      const courses = await this.courseRepository.find({ relations: ['user'] });
      const enrolledCourses = courses.filter(course =>
        course.user.some(existingUser => existingUser.id === user.id)
      );

      if (enrolledCourses.length === 0) {
        throw new UnauthorizedException('The user is not enrolled in any course'); // Kursda bo'lmasa
      }

      const coursesWithDetails = await this.courseRepository.find({
        relations: [
          'module',
          'module.lesson',
          'module.lesson.assignment',
          'module.lesson.assignment.result',
          'module.lesson.assignment.result.user',
        ],
      });

      // Foydalanuvchining ballarini hisoblash
      const courseScores = enrolledCourses.map(course => {
        const totalScore = coursesWithDetails.find(c => c.id === course.id)?.module.reduce((moduleAcc, module) => {
          return module.lesson.reduce((lessonAcc, lesson) => {
            return lesson.assignment.result.reduce((assignmentAcc, result) => {
              if (result.user.id === user.id) {
                return assignmentAcc + result.ball; // Foydalanuvchi ballarini yig'ish
              }
              return assignmentAcc;
            }, lessonAcc);
          }, moduleAcc);
        }, 0) || 0;

        return {
          courseId: course.id,
          courseName: course.name,
          totalScore,
          username: user.username, // Foydalanuvchining username
          email: user.email,       // Foydalanuvchining email
        };
      });

      return courseScores; // Har bir kurs bo'yicha ballar
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new UnauthorizedException('Invalid access token');
      }
    }
  }

}