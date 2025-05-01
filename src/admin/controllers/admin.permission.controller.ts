import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PermissionsService } from '../services/admin.permission.service';
import { Permission } from '../entities/permission.entity';
import { CreatePermissionDto } from '../dto/request.dtos/create.permission.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { CreateGenericResponseDto } from '../dto/response.dtos/create.generic.response.dto';

@Controller('admin/permission')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}


  @Serialize(CreateGenericResponseDto)
  @Post('create')
  create(@Body() payload: CreatePermissionDto): Promise<Permission> {
    return this.permissionsService.create(payload);
  }

  @Get()
  findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Permission> {
    return this.permissionsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.permissionsService.remove(+id);
  }
}
