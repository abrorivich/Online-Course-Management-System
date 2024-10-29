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

  // async create(accessToken: string, { homework, assignmentId }: CreateResultDto) {
  //   try {
  //     const payload = this.jwtService.verify(accessToken);
  //     const users = await this.userRepository.findOne({ where: { id: payload.id } });
  //     if (!users) {
  //       throw new UnauthorizedException('User not found');
  //     }

  //     const assignment = await this.assignmentRepository.findOne({ 
  //       where: { id: assignmentId },
  //       relations: ["lesson", "lesson.modules", "lesson.modules.course", "lesson.modules.course.user"]
  //      })
  //     if (!assignment)
  //       throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);

  //     const isUserInCourse = assignment.lesson.modules.course.user.some(user => user.id === users.id)     
  //     if (isUserInCourse === false) {
  //       throw new UnauthorizedException('User is not enrolled in the course for this assignment');
  //     }

  //     const result = await this.resultRepository.create({ homework, assignment, user: users });
  //     await this.resultRepository.save(result);
  //     return result
  //   } catch (error) {
  //     throw new UnauthorizedException('Invalid access token');
  //   }
  // }

  async create(accessToken: string, { homework, assignmentId }: CreateResultDto) {
    try {
      const payload = this.jwtService.verify(accessToken);
      const users = await this.userRepository.findOne({ where: { id: payload.id } });
      if (!users) {
        throw new UnauthorizedException('User not found');
      }
      const assignment = await this.assignmentRepository.findOne({
        where: { id: assignmentId },
        relations: ["lesson", "lesson.modules", "lesson.modules.course", "lesson.modules.course.user"]
      });
      if (!assignment) {
        throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
      }
      const isUserInCourse = assignment.lesson.modules.course.user.some(user => user.id === users.id);
      if (!isUserInCourse) {
        throw new UnauthorizedException('User is not enrolled in the course for this assignment');
      }
      // Takroriy result ni tekshirish
      const existingResult = await this.resultRepository.findOne({
        where: {
          assignment: { id: assignment.id },
          user: { id: users.id }
        }
      });
      if (existingResult) {
        if (existingResult.ball > 0) { // 0 dan katta baho mavjud bo'lsa
          return 'You have been graded, you cannot update'
        }
        // Agar mavjud natijani yangilamoqchi bo'lsangiz
        existingResult.homework = homework; // Yangi homeworkni o'rnating
        await this.resultRepository.save(existingResult); // Saqlang
        return existingResult; // Yangilangan natijani qaytaring

      }
      const result = await this.resultRepository.create({ homework, assignment, user: users });
      await this.resultRepository.save(result);
      return result;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async findAll(): Promise<Result[]> {
    try {
      const result = await this.resultRepository.find({ relations: ['assignment', 'user'] })
      return result
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number): Promise<Result> {
    try {
      let result = await this.resultRepository.findOne({
        where: { id },
        relations: ['assignment', 'user'],
      })
      if (!result)
        throw new HttpException('Result not found', HttpStatus.NOT_FOUND);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, {status, teacherMessage, ball }: UpdateResultDto) {
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
