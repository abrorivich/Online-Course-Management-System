import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Repository } from 'typeorm';
import { Modules } from 'src/modules/entities/module.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
    @InjectRepository(Modules) private modulesRepository: Repository<Modules>,
  ) { }

  async create({ name, description, modulesId }: CreateLessonDto): Promise<Lesson> {
    try {
      const modules = await this.modulesRepository.findOneBy({ id: modulesId })
      if (!modules)
        throw new HttpException('Modules not found', HttpStatus.NOT_FOUND);
      const lesson = await this.lessonRepository.create({ name, description, modules });
      await this.lessonRepository.save(lesson);
      return lesson
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Lesson[]> {
    try {
      const lesson = await this.lessonRepository.find({ relations: ['modules'] })
      return lesson
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number): Promise<Lesson> {
    try {
      let lesson = await this.lessonRepository.findOne({
        where: { id },
        relations: ['modules'],
      })
      if (!lesson)
        throw new HttpException('Lesson not found', HttpStatus.NOT_FOUND);
      return lesson;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, { name, description, modulesId }: UpdateLessonDto): Promise<string> {
    try {
      const modules = await this.modulesRepository.findOneBy({ id: modulesId })
      if (!modules)
        throw new HttpException('Modules not found', HttpStatus.NOT_FOUND);
      let lesson = await this.lessonRepository.findOneBy({ id })
      if (!lesson) {
        throw new HttpException('Lesson not found', HttpStatus.NOT_FOUND);
      }
      await this.lessonRepository.update({ id }, { name, description, modules });
      return `Update lesson 👌🏻`
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number): Promise<string> {
    try {
      let lesson = await this.lessonRepository.findOneBy({ id })
      if (!lesson) {
        throw new HttpException('Lesson not found', HttpStatus.NOT_FOUND);
      }
      await this.lessonRepository.delete(id);
      return "Deleted 🛒"
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
