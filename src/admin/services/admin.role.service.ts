import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/request.dtos/create.role.dto';
import { Permission } from '../entities/permission.entity';
import { PaginationQueryParams } from '../../user/dto/request.dtos/fetch.user.list.dto';
import loggernaut from 'loggernaut';
import { UpdateRoleDto } from '../dto/request.dtos/update.role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(payload: CreateRoleDto): Promise<Role> {
    try {
      /* TODO:
       * Take permission_ids from payload
       * check if the permissions exist in the database
       * if they exist, add them to the role
       * if they don't exist, throw an error
       */

      // Extract permission IDs from payload
      const permissionIds = payload.permission_ids || [];
      let permissions: Permission[] = [];
      console.log(payload);
      if (permissionIds.length > 0) {
        permissions = await this.permissionRepository.findBy({
          id: In(permissionIds),
        });
        if (permissions.length !== permissionIds.length) {
          const foundPermissionIds = permissions.map((p) => p.id);
          const invalidIds = permissionIds.filter(
            (id) => !foundPermissionIds.includes(id),
          );
          throw new BadRequestException(
            `Invalid permission IDs: ${invalidIds.join(', ')}`,
          );
        }
      }
      console.log(permissions);
      const role: Role = this.rolesRepository.create({
        ...payload,
        permissions,
      });
      return await this.rolesRepository.save(role);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(queryParams: PaginationQueryParams): Promise<Role[]> {
    try {
      const {
        search,
        page,
        limit,
      }: { search?: string; page?: any; limit?: any } = queryParams;
      const query: SelectQueryBuilder<Role> =
        this.rolesRepository.createQueryBuilder('roles');
      if (search) {
        query.where('name ILIKE :search AND is_enabled = :enabled', {
          enabled: true,
          search: `%${search}%`,
        });
      } else {
        query.where('is_enabled = :enabled', {
          enabled: true,
        });
      }
      const totalCount: number = await this.rolesRepository.count();

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
      let [data, filterCount] = filterResult;
      filterCount = search ? filterCount : data.length;
      return {
        totalCount,
        filterCount,
        roleList: data,
      };
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message, error.status);
    }
  }

  async findOne(id: string): Promise<Role> {
    // TODO: add permission information in the details API response
    try {
      const roleInfo: Role | null = await this.rolesRepository.findOne({
        where: {
          id,
        },
      });
      if (!roleInfo) {
        throw new NotFoundException('Role not found!');
      }
      return roleInfo;
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message, error.status);
    }
  }

  async update(id: string, payload: UpdateRoleDto): Promise<Role> {
    // TODO: this function should also update permissions addition and removal both
    try {
      const role: Role | null = await this.rolesRepository.findOne({
        where: { id },
      });

      if (!role) {
        throw new NotFoundException('Role not found!');
      }

      // Merge the existing role with the new data
      const updatedRole: Role = this.rolesRepository.merge(role, payload);

      // Save the updated organization back to the database
      return await this.rolesRepository.save(updatedRole);
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<Role> {
    try {
      const role: Role | null = await this.rolesRepository.findOne({
        where: { id },
      });

      if (!role) {
        throw new NotFoundException('Role not found!');
      }

      // Update the role for soft delete
      role.is_enabled = false;
      // Save the updated role back to the database
      return await this.rolesRepository.save(role);
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
