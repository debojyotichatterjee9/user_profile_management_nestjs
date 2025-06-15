import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from '../services/admin.role.service';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { CreateGenericResponseDto } from '../dto/response.dtos/create.generic.response.dto';
import { CreateRoleDto } from '../dto/request.dtos/create.role.dto';
import { RoleListResponseDto } from '../dto/response.dtos/role.list.dto.response';
import { PaginationQueryParams } from '../dto/request.dtos/generic.pagination.list.dto';
import { GenericCreateUpdateDeleteResponseDto } from '../dto/response.dtos/generic.create.update.delete.response.dto';
import { UpdateRoleDto } from '../dto/request.dtos/update.role.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../config/generic.constants';

@Controller('admin/role')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.SUPER_ADMIN)
  @Serialize(CreateGenericResponseDto)
  @Post('create')
  create(@Body() role: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(role);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.SUPER_ADMIN)
  @Serialize(RoleListResponseDto)
  @Get('list')
  findAll(@Query() queryParams: PaginationQueryParams): Promise<Role[]> {
    return this.rolesService.findAll(queryParams);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.SUPER_ADMIN)
  @Serialize(GenericCreateUpdateDeleteResponseDto)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(id, payload);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.SUPER_ADMIN)
  @Serialize(GenericCreateUpdateDeleteResponseDto)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Role> {
    return this.rolesService.remove(id);
  }
}
