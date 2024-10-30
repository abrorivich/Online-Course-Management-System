import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Assignment } from './entities/assignment.entity';
import { RolesAdminGuard } from 'src/auth/rolesAdmin.guard';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) { }
  
  // admin token beradi
  @UseGuards(AuthGuard, RolesAdminGuard)
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
  
  // admin token beradi
  @UseGuards(AuthGuard, RolesAdminGuard)
  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateAssignmentDto: UpdateAssignmentDto): Promise<string> {
    return this.assignmentsService.update(+id, updateAssignmentDto);
  }
  
  // admin token beradi
  @UseGuards(AuthGuard, RolesAdminGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: number): Promise<string> {
    return this.assignmentsService.remove(+id);
  }
}
