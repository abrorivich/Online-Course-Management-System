import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Modules } from './entities/module.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/course/entities/course.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Modules) private modulesRepository: Repository<Modules>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) { }

  async create({ name, description, courseId }: CreateModuleDto): Promise<Modules> {
    try {
      const course = await this.courseRepository.findOneBy({ id: courseId })
      if (!course)
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      const modules = await this.modulesRepository.create({ name, description, course });
      await this.modulesRepository.save(modules);
      return modules
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Modules[]> {
    try {

      const modules = await this.modulesRepository.find({ relations: ['course', "lesson"] })
      return modules
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number): Promise<Modules> {
    try {

      let modules = await this.modulesRepository.findOne({
        where: { id },
        relations: ['course'],
      })
      if (!modules)
        throw new HttpException('Modules not found', HttpStatus.NOT_FOUND);
      return modules;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, { name, description, courseId }: UpdateModuleDto): Promise<string> {
    try {

      const course = await this.courseRepository.findOneBy({ id: courseId })
      if (!course)
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      let modules = await this.modulesRepository.findOneBy({ id })
      if (!modules) {
        throw new HttpException('Modules not found', HttpStatus.NOT_FOUND);
      }
      await this.modulesRepository.update({ id }, { name, description, course });
      return `Update modules 👌🏻`
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number): Promise<string> {
    try {

      let modules = await this.modulesRepository.findOneBy({ id })
      if (!modules) {
        throw new HttpException('Modules not found', HttpStatus.NOT_FOUND);
      }
      await this.modulesRepository.delete(id);
      return "Deleted 🛒"
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
