import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { CreatePermissionDto } from '../dto/request.dtos/create.permission.dto';
import { PaginationQueryParams } from '../dto/request.dtos/generic.pagination.list.dto';
import { PermissionListResponseDto } from '../dto/response.dtos/permission.list.response.dto';
import loggernaut from 'loggernaut';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async create(payload: CreatePermissionDto): Promise<Permission> {
    try {
      const permission: Permission = this.permissionsRepository.create(payload);
      return await this.permissionsRepository.save(permission);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(
    queryParams: PaginationQueryParams,
  ): Promise<PermissionListResponseDto> {
    try {
      const {
        search,
        page,
        limit,
      }: { search?: string; page?: any; limit?: any } = queryParams;
      const query =
        this.permissionsRepository.createQueryBuilder('permissions');
      if (search) {
        query.where(
          'name ILIKE :search OR contact_email ILIKE :search AND is_deleted = :deleted',
          {
            deleted: false,
            search: `%${search}%`,
          },
        );
      } else {
        query.where('is_deleted = :deleted', {
          deleted: false,
        });
      }
      const totalCount = await this.permissionsRepository.count();

      if (page > totalCount && limit > totalCount) {
        throw new NotFoundException(
          'The page number exceeds the maximum number of records.',
        );
      }

      const [filterResult] = await Promise.all([
        query
          .skip((page - 1) * limit)
          .take(limit)
          .getManyAndCount(),
      ]);
      const [data, filterCount] = filterResult;
      return {
        totalCount,
        filterCount,
        permissionList: data,
      };
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message, error.status);
    }
  }

  /**
   * Retrieves a single permission by its identifier.
   * @param id - The unique identifier of the permission to retrieve.
   * @returns A promise that resolves to the found Permission object, including its related roles.
   */
  findOne(id: number): Promise<Permission> {
    return this.permissionsRepository.findOne(id, { relations: ['roles'] });
  }

  async remove(id: number): Promise<void> {
    await this.permissionsRepository.delete(id);
  }
}
