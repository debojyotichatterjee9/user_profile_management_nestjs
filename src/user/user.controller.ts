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
import { UserDetailsResponsetDto } from './dto/response.dtos/user.details.response.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Serialize(CreateUserResponseDto)
  @Post('register')
  register(@Body() payload: RegisterUserDto) {
    return this.userService.registerUser(payload);
  }

  @Serialize(CreateUserResponseDto)
  @Post('create')
  create(@Body() payload: CreateUserDto) {
    return this.userService.createUser(payload);
  }

  @UseGuards(AuthGuard)
  @Serialize(UserListResponseDto)
  @Get('list')
  userList(@Query() queryParams: PaginationQueryParams) {
    // TODO: Default the page and limit to 10 from the config and remove the two fields from thw DTO
    return this.userService.getUserList(queryParams);
  }

  @UseGuards(AuthGuard)
  @Serialize(UserDetailsResponsetDto)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Serialize(UpdateUserResponseDto)
  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.userService.update(id, payload);
  }

  @UseGuards(AuthGuard)
  @Serialize(DeleteUserResponseDto)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
