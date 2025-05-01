import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/request.dtos/create.role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(payload: CreateRoleDto): Promise<Role> {
    try {
      /* TODO:
      * Take permission_ids from payload
      * check if the permissions exist in the database
      * if they exist, add them to the role
      * if they don't exist, throw an error
      */


      const role: Role = this.rolesRepository.create(payload);
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
