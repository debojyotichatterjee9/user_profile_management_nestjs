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
import { RolesService } from '../services/admin.role.service';
import { Role } from '../entities/role.entity';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { CreateGenericResponseDto } from '../dto/response.dtos/create.generic.response.dto';
import { CreateRoleDto } from '../dto/request.dtos/create.role.dto';
import { RoleListResponseDto } from '../dto/response.dtos/role.list.dto.response';
import { PaginationQueryParams } from '../dto/request.dtos/generic.pagination.list.dto';
import { GenericCreateUpdateDeleteResponseDto } from '../dto/response.dtos/generic.create.update.delete.response.dto';
import { UpdateRoleDto } from '../dto/request.dtos/update.role.dto';

@Controller('admin/role')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Serialize(CreateGenericResponseDto)
  @Post('create')
  create(@Body() role: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(role);
  }

  @Serialize(RoleListResponseDto)
  @Get('list')
  findAll(@Query() queryParams: PaginationQueryParams): Promise<Role[]> {
    return this.rolesService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Serialize(GenericCreateUpdateDeleteResponseDto)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(id, payload);
  }

  @Serialize(GenericCreateUpdateDeleteResponseDto)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Role> {
    return this.rolesService.remove(id);
  }
}
