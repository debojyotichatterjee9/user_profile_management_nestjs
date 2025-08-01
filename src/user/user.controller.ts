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
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dto/request.dtos/create.user.dto';
import { PaginationQueryParams } from './dto/request.dtos/fetch.user.list.dto';
import { RegisterUserDto } from './dto/request.dtos/register.user.dto';
import { UpdateUserDto } from './dto/request.dtos/update.user.dto';
import { CreateUserResponseDto } from './dto/response.dtos/user.create.response.dto';
import { UserListResponseDto } from './dto/response.dtos/user.list.response.dto';
import { UserService } from './user.service';
import { UpdateUserResponseDto } from './dto/response.dtos/user.update.response.dto';
import { DeleteUserResponseDto } from './dto/response.dtos/user.delete.response.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Serialize(CreateUserResponseDto)
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.registerUser(registerUserDto);
  }

  @Serialize(CreateUserResponseDto)
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Serialize(UserListResponseDto)
  @Get('list')
  userList(@Query() queryParams: PaginationQueryParams) {
    // TODO: Default the page and limit to 10 from the config and remove the two fields from thw DTO
    return this.userService.getUserList(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Serialize(UpdateUserResponseDto)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Serialize(DeleteUserResponseDto)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
