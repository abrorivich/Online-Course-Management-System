import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Assignment } from './entities/assignment.entity';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Post("create")
  create(@Body() createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get("getAll")
  findAll(): Promise<Assignment[]> {
    return this.assignmentsService.findAll();
  }

  @Get('getById/:id')
  findOne(@Param('id') id: number): Promise<Assignment> {
    return this.assignmentsService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateAssignmentDto: UpdateAssignmentDto): Promise<string> {
    return this.assignmentsService.update(+id, updateAssignmentDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number): Promise<string> {
    return this.assignmentsService.remove(+id);
  }
}
