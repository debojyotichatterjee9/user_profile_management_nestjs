import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/request.dtos/create.role.dto';
import { Permission } from '../entities/permission.entity';

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
      const role: Role = this.rolesRepository.create({
        ...payload,
        permissions,
      });
      return await this.rolesRepository.save(role);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  findAll(): Promise<Role[]> {
    return this.rolesRepository.find({ relations: ['permissions'] });
  }

  findOne(id: number): Promise<Role> {
    return this.rolesRepository.findOne(id, { relations: ['permissions'] });
  }

  async remove(id: number): Promise<void> {
    await this.rolesRepository.delete(id);
  }
}
