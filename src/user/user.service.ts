import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import loggernaut from 'loggernaut';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/request.dtos/create.user.dto';
import { PaginationQueryParams } from './dto/request.dtos/fetch.user.list.dto';
import { RegisterUserDto } from './dto/request.dtos/register.user.dto';
import { UpdateUserDto } from './dto/request.dtos/update.user.dto';
import { User } from './entities/user.entity';
import { MetaData } from './entities/user.metadata.entity';
import { CreateUserResponseDto } from './dto/response.dtos/user.create.response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async registerUser(
    registerUserDto: RegisterUserDto,
  ): Promise<CreateUserResponseDto> {
    const {
      name_prefix,
      first_name,
      middle_name,
      last_name,
      name_suffix,
      email,
      password,
    } = registerUserDto;

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
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async getUserList(
    queryParams: PaginationQueryParams,
  ): Promise<{ totalCount: number; filterCount: number; userList: User[] }> {
    // TODO: need to fix the type for the line below
    const {
      search,
      page,
      limit,
    }: { search?: string; page?: any; limit?: any } = queryParams;
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.name', 'name')
      .leftJoinAndSelect('user.identification', 'identification')
      .leftJoinAndSelect('user.authentication', 'authentication')
      .leftJoinAndSelect('user.address', 'address')
      .leftJoinAndSelect('user.contact', 'contact')
      .leftJoinAndSelect('user.social_profiles', 'social_profiles')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('user.meta_data', 'meta_data');

    if (search) {
      query.where(
        'name.first_name ILIKE :search OR name.last_name ILIKE :search OR email ILIKE :search',
        { search: `%${search}%` },
      );
    }
    const totalCount = await this.userRepository.count();

    if (page >= totalCount && limit > totalCount) {
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
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
