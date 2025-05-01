import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { CreatePermissionDto } from '../dto/request.dtos/create.permission.dto';

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

  findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find({ relations: ['roles'] });
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
