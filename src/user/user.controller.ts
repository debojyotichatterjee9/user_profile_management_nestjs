import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request.dtos/create.user.dto';
import { UpdateUserDto } from './dto/request.dtos/update.user.dto';
import { PaginationQueryParams } from './dto/request.dtos/fetch.user.list.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @UseInterceptors(SerializeInterceptor)
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseInterceptors(SerializeInterceptor)
  @Get('list')
  userList(@Query() queryParams: PaginationQueryParams) {
    // TODO: Default the page and limit to 10 from the config and remove the two fields from thw DTO
    return this.userService.getUserList(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
