import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import loggernaut from 'loggernaut';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/request.dtos/create.user.dto';
import { PaginationQueryParams } from './dto/request.dtos/fetch.user.list.dto';
import { RegisterUserDto } from './dto/request.dtos/register.user.dto';
import { UpdateUserDto } from './dto/request.dtos/update.user.dto';
import { CreateUserResponseDto } from './dto/response.dtos/user.create.response.dto';
import { UserListResponseDto } from './dto/response.dtos/user.list.response.dto';
import { User } from './entities/user.entity';
import { MetaData } from './entities/user.metadata.entity';
import { ConfigService } from '@nestjs/config';
import { NIL as NIL_UUID, validate as uuidValidate } from 'uuid';
import { Role } from '../admin/entities/role.entity';
import { OrganizationService } from '../organization/organization.service';
import { UserDetailsResponsetDto } from './dto/response.dtos/user.details.response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly organizationService: OrganizationService,
    private readonly configService: ConfigService,
  ) {}
  async registerUser(
    registerUserDto: RegisterUserDto,
  ): Promise<CreateUserResponseDto> {
    try {
      const {
        name_prefix,
        first_name,
        middle_name,
        last_name,
        name_suffix,
        email,
        password,
      } = registerUserDto;
      const existingUserInfo = await this.userRepository.findOne({
        where: {
          email,
        },
      });
      if (existingUserInfo) {
        throw new BadRequestException(
          'User with the provided email already exists.',
        );
      }

      const userObj = new User();

      userObj.name_prefix = name_prefix;
      userObj.first_name = first_name;
      userObj.middle_name = middle_name;
      userObj.last_name = last_name;
      userObj.name_suffix = name_suffix;
      userObj.email = email.toLowerCase();
      userObj.setPassword(password);
      userObj.meta_data = new MetaData();
      userObj.meta_data.is_enabled = true;
      const user = this.userRepository.create(userObj);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    try {
      // Validate organization_id if provided
      if (createUserDto.organization_id && createUserDto.organization_id !== NIL_UUID) {
        await this.organizationService.findOne(createUserDto.organization_id);
      }

      // Validate role_id if provided
      if (createUserDto.role_id && createUserDto.role_id !== NIL_UUID) {
        const role = await this.roleRepository.findOne({ where: { id: createUserDto.role_id } });
        if (!role) {
          throw new BadRequestException('Invalid role ID provided');
        }
      }

      let userObj = new User();
      userObj.setPassword(createUserDto.password);
      userObj = { ...userObj, ...createUserDto };
      const user = this.userRepository.create(userObj);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserList(
    queryParams: PaginationQueryParams,
  ): Promise<UserListResponseDto> {
    try {
      let {
        search,
        page = 1,
        limit = null,
      }: { search?: string; page?: any; limit?: any } = queryParams;
      const query = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.identification', 'identification')
        .leftJoinAndSelect('user.address', 'address')
        .leftJoinAndSelect('user.contact', 'contact')
        .leftJoinAndSelect('user.social_profiles', 'social_profiles')
        .leftJoinAndSelect('user.meta_data', 'meta_data');

      if (search) {
        query.where(
          'first_name ILIKE :search OR last_name ILIKE :search OR email ILIKE :search AND meta_data.is_deleted = :deleted',
          { search: `%${search}%`, deleted: false },
        );
      } else {
        query.where('meta_data.is_deleted = :deleted', { deleted: false });
      }
      const totalCount = await this.userRepository.count();

      limit ??= totalCount;

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
        userList: data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<UserDetailsResponsetDto> {
    try {
      const userInfo: any = await this.userRepository.findOne({ //TODO: Fix this any type
        relations: {
          identification: true,
          address: true,
          contact: true,
          social_profiles: true,
          meta_data: true,
        },
        where: {
          id,
        },
      });
      if (!userInfo) {
        throw new NotFoundException('User not found!');
      }
      // Fetch organization if user has organization assigned.
      if (userInfo.organization_id && userInfo.organization_id !== NIL_UUID) {
        const organizationInfo = await this.organizationService.findOne(
          userInfo.organization_id,
        );
        userInfo.organization = organizationInfo;
      }

      // Fetch role and permissions if user has a role assigned
      if (userInfo.role_id && userInfo.role_id !== NIL_UUID) {
        const roleWithPermissions = await this.roleRepository
          .createQueryBuilder('role')
          .leftJoinAndSelect('role.permissions', 'permissions', 'permissions.is_enabled = :permEnabled', { permEnabled: true })
          .select([
            'role.id',
            'role.name',
            'role.is_enabled',
            'permissions.id',
            'permissions.name',
            'permissions.description',
            'permissions.is_enabled',
          ])
          .where('role.id = :roleId AND role.is_enabled = true', {
            roleId: userInfo.role_id,
          })
          .getOne();

        // Add role and permissions to the user object
        if (roleWithPermissions) {
          userInfo.role = {
            id: roleWithPermissions.id,
            name: roleWithPermissions.name,
            is_enabled: roleWithPermissions.is_enabled,
            permissions: roleWithPermissions.permissions || [],
          };
        }
      }
      return userInfo;
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message, error.statusCode);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (
        updateUserDto.hasOwnProperty('password') ||
        updateUserDto.hasOwnProperty('organization_id')
      ) {
        throw new BadRequestException('Invalid Payload!');
      }
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      // Merge the existing user with the new data
      const updatedUser = this.userRepository.merge(user, updateUserDto);

      // Save the updated user back to the database
      return await this.userRepository.save(updatedUser);
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: { meta_data: true },
      });

      if (!user || user.meta_data.is_deleted) {
        throw new NotFoundException('User not found!');
      }

      // Update the meta_data for soft delete
      user.meta_data.is_deleted = true;
      user.meta_data.deleted_on = new Date();

      // Save the updated user back to the database
      return await this.userRepository.save(user);
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async findUserByIdentity(userIdentity: string) {
    try {
      let userInfo;
      const activeUserConditions = {
        'meta_data.is_enabled': true,
        'meta_data.is_activated': true,
        'meta_data.is_deleted': false,
      };
      const metaDataCondQuery = `
            meta_data.is_enabled = :isEnabled 
            AND meta_data.is_activated = :isActivated 
            AND meta_data.is_deleted = :isDeleted
        `;
      if (uuidValidate(userIdentity)) {
        userInfo = await this.userRepository
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.meta_data', 'meta_data')
          .where('user.id = :id', { id: userIdentity })
          .andWhere(metaDataCondQuery, {
            isEnabled: activeUserConditions['meta_data.is_enabled'],
            isActivated: activeUserConditions['meta_data.is_activated'],
            isDeleted: activeUserConditions['meta_data.is_deleted'],
          })
          .getOne();
      } else {
        userInfo = await this.userRepository
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.meta_data', 'meta_data')
          .where('user.email = :email OR user.username = :username', {
            email: userIdentity,
            username: userIdentity,
          })
          .andWhere(metaDataCondQuery, {
            isEnabled: activeUserConditions['meta_data.is_enabled'],
            isActivated: activeUserConditions['meta_data.is_activated'],
            isDeleted: activeUserConditions['meta_data.is_deleted'],
          })
          .getOne();
      }
      if (!userInfo) {
        throw new NotFoundException(
          'User with the email/username does not exist',
        );
      }
      // Fetch organization if user has organization assigned.
      if (userInfo.organization_id && userInfo.organization_id !== NIL_UUID) {
        const organizationInfo = await this.organizationService.findOne(
          userInfo.organization_id,
        );
        userInfo.organization = organizationInfo;
      }

      if (userInfo.role_id && userInfo.role_id !== NIL_UUID) {
        const roleWithPermissions = await this.roleRepository
          .createQueryBuilder('role')
          .leftJoinAndSelect('role.permissions', 'permissions', 'permissions.is_enabled = :permEnabled', { permEnabled: true })
          .select([
            'role.id',
            'role.name',
            'role.is_enabled',
            'permissions.id',
            'permissions.name',
            'permissions.is_enabled',
          ])
          .where('role.id = :roleId AND role.is_enabled = true', {
            roleId: userInfo.role_id,
          })
          .getOne();
        // Add role and permissions to the user object
        if (roleWithPermissions) {
          userInfo.role = {
            id: roleWithPermissions.id,
            name: roleWithPermissions.name,
            is_enabled: roleWithPermissions.is_enabled,
            permissions: roleWithPermissions.permissions || [],
          };
        }
      }
      return userInfo;
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
