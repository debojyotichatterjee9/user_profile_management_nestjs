import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RolesService } from '../services/admin.role.service';
import { Role } from '../entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(+id);
  }

  @Post()
  create(@Body() role: Role): Promise<Role> {
    return this.rolesService.create(role);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.rolesService.remove(+id);
  }
}
