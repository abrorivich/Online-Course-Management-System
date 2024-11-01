import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Result, Status } from './entities/result.entity';
import { Repository } from 'typeorm';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Course } from 'src/course/entities/course.entity';
import { log } from 'util';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result) private resultRepository: Repository<Result>,
    @InjectRepository(Assignment) private assignmentRepository: Repository<Assignment>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    private readonly jwtService: JwtService,
  ) { }
  async create(accessToken: string, { homework, assignmentId }: CreateResultDto) {
    try {
      const payload = this.jwtService.verify(accessToken);
      const user = await this.userRepository.findOne({ where: { id: payload.id } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const assignment = await this.assignmentRepository.findOne({
        where: { id: assignmentId },
        relations: ["lesson", "lesson.modules", "lesson.modules.course", "lesson.modules.course.user"]
      });

      if (!assignment) {
        throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
      }

      const isUserInCourse = assignment.lesson.modules.course.user.some(courseUser => courseUser.id === user.id);
      if (!isUserInCourse) {
        throw new UnauthorizedException('User is not enrolled in the course for this assignment');
      }

      const existingResult = await this.resultRepository.findOne({
        where: {
          assignment: { id: assignment.id },
          user: { id: user.id }
        }
      });

      if (existingResult) {
        if (existingResult.ball > 0) {
          throw new HttpException('You have been graded, you cannot update', HttpStatus.FORBIDDEN);
        }
        existingResult.homework = homework;
        await this.resultRepository.save(existingResult);
        return existingResult;
      }

      const result = await this.resultRepository.create({
        homework,
        assignment: {
          ...assignment,
          lesson: {
            ...assignment.lesson,
            modules: {
              ...assignment.lesson.modules,
              course: {
                ...assignment.lesson.modules.course,
                user: assignment.lesson.modules.course.user.map(({ password, ...user }) => user)
              }
            }
          }
        },
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          age: user.age,
          from: user.from,
          role: user.role,
        }
      });

      await this.resultRepository.save(result);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Invalid access token', HttpStatus.UNAUTHORIZED);
      }
    }
  }



  async findAll() {
    try {
      const results = await this.resultRepository.find({
        relations: ['assignment', 'user'],
      });

      // Har bir natijani o'zgartirish va foydalanuvchi ma'lumotlaridan nozik maydonlarni olib tashlash
      const filteredResults = results.map(result => {
        const { password, ...userWithoutSensitiveData } = result.user;
        return {
          ...result,
          user: userWithoutSensitiveData,
        };
      });

      return filteredResults;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Ichki server xatosi', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.resultRepository.findOne({
        where: { id },
        relations: ['assignment', 'user'],
      });

      if (!result) {
        throw new HttpException('Result not found', HttpStatus.NOT_FOUND);
      }

      // Foydalanuvchi ma'lumotlarini o'zgartirish
      const { password, ...userWithoutSensitiveData } = result.user;

      return {
        ...result,
        user: userWithoutSensitiveData,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, { status, teacherMessage, ball }: UpdateResultDto) {
    try {
      const result = await this.resultRepository.findOneBy({ id })
      if (!result)
        throw new HttpException('Result not found', HttpStatus.NOT_FOUND);
      await this.resultRepository.update({ id }, { status: Status.Bajarilgan, teacherMessage, ball });
      return `Update assignment 👌🏻`
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number): Promise<string> {
    try {
      let result = await this.resultRepository.findOneBy({ id })
      if (!result) {
        throw new HttpException('Result not found', HttpStatus.NOT_FOUND);
      }
      await this.resultRepository.delete(id);
      return "Deleted 🛒"
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
