import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Modules } from './entities/module.entity';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post("create")
  create(@Body() createModuleDto: CreateModuleDto): Promise<Modules> {
    return this.modulesService.create(createModuleDto);
  }
  
  @Get("getAll")
  findAll() {
    return this.modulesService.findAll();
  }
  
  @Get('getById/:id')
  findOne(@Param('id') id: number): Promise<Modules> {
    return this.modulesService.findOne(+id);
  }
  
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateModuleDto: UpdateModuleDto): Promise<string> {
    return this.modulesService.update(+id, updateModuleDto);
  }
  
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: number): Promise<string> {
    return this.modulesService.remove(+id);
  }
}
