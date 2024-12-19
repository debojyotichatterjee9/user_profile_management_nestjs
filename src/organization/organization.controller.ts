import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/request.dtos/create.organization.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateOrganizationResponseDto } from './dto/response.dtos/create.organization.response.dto';
import { UpdateOrganizationDto } from './dto/request.dtos/update.organization.dto';
import { PaginationQueryParams } from './dto/request.dtos/fetch.organization.list.dto';
import { OrganizationListResponseDto } from './dto/response.dtos/fetch.organization.list.response.dto';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Serialize(CreateOrganizationResponseDto)
  @Post('create')
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return await this.organizationService.create(createOrganizationDto);
  }

  @Serialize(OrganizationListResponseDto)
  @Get('list')
  findAll(@Query() queryParams: PaginationQueryParams) {
    return this.organizationService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}
