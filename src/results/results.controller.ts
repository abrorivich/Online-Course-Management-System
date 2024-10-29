import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Result } from './entities/result.entity';
import { RolesUserGuard } from 'src/auth/roleUser.guard';
import { RolesAdminGuard } from 'src/auth/rolesAdmin.guard';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) { }

  @UseGuards(AuthGuard, RolesUserGuard)
  @Post("create")
  create(@Headers('authorization') authorizationHeader: string, @Body() createResultDto: CreateResultDto): Promise<Result> {
    const tokens = authorizationHeader.split(' ');
    const accessToken = tokens[1];
    return this.resultsService.create(accessToken, createResultDto);
  }
  
  @Get("getAll")
  findAll(): Promise<Result[]> {
    return this.resultsService.findAll();
  }
  
  @Get('getById/:id')
  findOne(@Param('id') id: number): Promise<Result> {
    return this.resultsService.findOne(+id);
  }
  
  @UseGuards(AuthGuard, RolesAdminGuard)
  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateResultDto: UpdateResultDto): Promise<string> {
    return this.resultsService.update(+id, updateResultDto);
  }
  
  @UseGuards(AuthGuard, RolesAdminGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: number): Promise<string> {
    return this.resultsService.remove(+id);
  }
}
