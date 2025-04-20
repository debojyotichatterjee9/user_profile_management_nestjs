import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PermissionsService } from '../services/admin.permission.service';
import { Permission } from '../entities/permission.entity';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Permission> {
    return this.permissionsService.findOne(+id);
  }

  @Post()
  create(@Body() permission: Permission): Promise<Permission> {
    return this.permissionsService.create(permission);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.permissionsService.remove(+id);
  }
}
