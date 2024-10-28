import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { Repository } from 'typeorm';
import { Lesson } from 'src/lessons/entities/lesson.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) { }

  async create({ name, description, deadline, lessonId }: CreateAssignmentDto) {
    const lesson = await this.lessonRepository.findOneBy({ id: lessonId })
    if (!lesson)
      throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
    const assignment = await this.assignmentRepository.create({ name, description, deadline, lesson });
    await this.assignmentRepository.save(assignment);
    return assignment
  }

  async findAll(): Promise<Assignment[]> {
    const assignment = await this.assignmentRepository.find({ relations: ['lesson'] })
    return assignment
  }

  async findOne(id: number): Promise<Assignment> {
    let assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['lesson'],
    })
    if (!assignment)
      throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
    return assignment;
  }

  async update(id: number, { name, description, deadline, lessonId}: UpdateAssignmentDto): Promise<string> {
    const lesson = await this.lessonRepository.findOneBy({ id: lessonId })
    if (!lesson)
      throw new HttpException('Lesson not found', HttpStatus.NOT_FOUND);
    let assignment = await this.assignmentRepository.findOneBy({ id })
    if (!assignment) {
      throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
    }
    await this.assignmentRepository.update({ id }, { name, description, deadline, lesson });
    return `Update assignment 👌🏻`
  }

  async remove(id: number): Promise<string> {
    let assignment = await this.assignmentRepository.findOneBy({ id })
    if (!assignment) {
      throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
    }
    await this.assignmentRepository.delete(id);
    return "Deleted 🛒"
  }
}
