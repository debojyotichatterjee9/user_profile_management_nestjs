import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const {
      name_prefix,
      first_name,
      middle_name,
      last_name,
      name_suffix,
      email,
      password,
    } = registerUserDto;

    const user = new User();
    user.email = email;
    user.name = {
      name_prefix: name_prefix,
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      name_suffix: name_suffix,
    };
    user.setPassword(password);
    return await this.userRepository.save(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }
  findAll() {
    return `This action returns all user`;
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
