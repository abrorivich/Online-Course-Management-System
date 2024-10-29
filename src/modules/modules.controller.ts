import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Modules } from './entities/module.entity';
import { RolesAdminGuard } from 'src/auth/rolesAdmin.guard';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @UseGuards(AuthGuard, RolesAdminGuard)
  @Post("create")
  create(@Body() createModuleDto: CreateModuleDto): Promise<Modules> {
    return this.modulesService.create(createModuleDto);
  }
  
  @Get("getAll")
  findAll(): Promise<Modules[]> {
    return this.modulesService.findAll();
  }
  
  @Get('getById/:id')
  findOne(@Param('id') id: number): Promise<Modules> {
    return this.modulesService.findOne(+id);
  }
  
  @UseGuards(AuthGuard, RolesAdminGuard)
  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateModuleDto: UpdateModuleDto): Promise<string> {
    return this.modulesService.update(+id, updateModuleDto);
  }
  
  @UseGuards(AuthGuard, RolesAdminGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: number): Promise<string> {
    return this.modulesService.remove(+id);
  }
}
