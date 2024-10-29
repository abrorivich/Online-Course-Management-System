import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { Repository } from 'typeorm';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result) private resultRepository: Repository<Result>,
    @InjectRepository(Assignment) private assignmentRepository: Repository<Assignment>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async create(accessToken: string, { homework, assignmentId }: CreateResultDto) {
    try {
      const payload = this.jwtService.verify(accessToken);
      const user = await this.userRepository.findOne({ where: { id: payload.id } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      // console.log(user);
      
      const assignment = await this.assignmentRepository.findOneBy({ id: assignmentId })
      if (!assignment)
        throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
      const result = await this.resultRepository.create({ homework, assignment, user });
      await this.resultRepository.save(result);
      return result
      // return "12"
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

  async update(id: number, { teacherMessage, ball }: UpdateResultDto) {
    try {
      const result = await this.resultRepository.findOneBy({ id })
      if (!result)
        throw new HttpException('Result not found', HttpStatus.NOT_FOUND);
      await this.resultRepository.update({ id }, { teacherMessage, ball });
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
