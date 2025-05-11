import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PermissionsService } from '../services/admin.permission.service';
import { Permission } from '../entities/permission.entity';
import { CreatePermissionDto } from '../dto/request.dtos/create.permission.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { CreateGenericResponseDto } from '../dto/response.dtos/create.generic.response.dto';
import { PermissionListResponseDto } from '../dto/response.dtos/permission.list.response.dto';
import { PaginationQueryParams } from '../dto/request.dtos/generic.pagination.list.dto';
import { GenericCreateUpdateDeleteResponseDto } from '../dto/response.dtos/generic.create.update.delete.response.dto';
import { UpdatePermissionDto } from '../dto/request.dtos/update.permission.dto';

@Controller('admin/permission')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Serialize(CreateGenericResponseDto)
  @Post('create')
  create(@Body() payload: CreatePermissionDto): Promise<Permission> {
    return this.permissionsService.create(payload);
  }

  @Serialize(PermissionListResponseDto)
  @Get('list')
  findAll(@Query() queryParams: PaginationQueryParams): Promise<Permission[]> {
    return this.permissionsService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Permission> {
    return this.permissionsService.findOne(id);
  }

  @Serialize(GenericCreateUpdateDeleteResponseDto)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdatePermissionDto,
  ): Promise<Permission> {
    console.log(payload);
    return this.permissionsService.update(id, payload);
  }

  @Serialize(GenericCreateUpdateDeleteResponseDto)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Permission> {
    return this.permissionsService.remove(id);
  }
}
