import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RolesService } from '../services/admin.role.service';
import { Role } from '../entities/role.entity';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { CreateGenericResponseDto } from '../dto/response.dtos/create.generic.response.dto';
import { CreateRoleDto } from '../dto/request.dtos/create.role.dto';

@Controller('admin/role')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Serialize(CreateGenericResponseDto)
  @Post('create')
  create(@Body() role: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(role);
  }

  @Get('list')
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.rolesService.remove(+id);
  }
}
