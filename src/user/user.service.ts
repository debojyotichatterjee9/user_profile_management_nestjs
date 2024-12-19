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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  /**
   * The function `registerUser` takes a `RegisterUserDto` object, creates a new user entity with the
   * provided data, and saves it to the database, returning a `CreateUserResponseDto`.
   *
   * :param registerUserDto: The `registerUserDto` parameter in the `registerUser` function contains
   * the following properties:
   * :type registerUserDto: RegisterUserDto
   * :return: The `registerUser` function is returning a Promise that resolves to a
   * `CreateUserResponseDto` object after creating and saving a new user based on the data provided in
   * the `registerUserDto`.
   */
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

  /**
   * The function `createUser` creates a new user using the provided data and returns the response.
   *
   * :param createUserDto: The `createUserDto` parameter in the `createUser` function likely represents a
   * data transfer object (DTO) that contains the information needed to create a new user. This object
   * may include properties such as username, email, password, and any other relevant user details
   * required for user creation
   * :type createUserDto: CreateUserDto
   * :return: The `createUser` function is returning a Promise that resolves to a `CreateUserResponseDto`
   * object. This object is created by saving the user data provided in the `createUserDto` using the
   * `userRepository`. If an error occurs during the process, a `BadRequestException` is thrown with the
   * error message.
   */
  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    try {
      let userObj = new User();
      userObj.setPassword(createUserDto.password);
      userObj = { ...userObj, ...createUserDto };
      const user = this.userRepository.create(userObj);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * This TypeScript function retrieves a list of users based on pagination query parameters, including
   * search criteria, and returns the total count, filtered count, and user list.
   *
   * :param queryParams: The `getUserList` function you provided is responsible for fetching a list of
   * users based on the pagination query parameters. Here's a breakdown of the function:
   * :type queryParams: PaginationQueryParams
   * :return: The `getUserList` function returns a Promise that resolves to a `UserListResponseDto`
   * object. This object contains the following properties:
   * - `totalCount`: Total count of users in the database.
   * - `filterCount`: Count of users after applying any filters based on the pagination query
   * parameters.
   * - `userList`: An array of user objects that match the search criteria and pagination limits.
   */
  async getUserList(
    queryParams: PaginationQueryParams,
  ): Promise<UserListResponseDto> {
    try {
      const {
        search,
        page,
        limit,
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
          'first_name ILIKE :search OR last_name ILIKE :search OR email ILIKE :search',
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * This TypeScript function asynchronously finds a user by their ID, fetching related information and
   * handling exceptions.
   *
   * :param id: The `findOne` function you provided is an asynchronous function that retrieves user
   * information based on the provided `id`. The function uses the `userRepository` to find a user with
   * the specified `id` and includes related entities such as identification, address, contact, social
   * profiles, and meta data
   * :type id: string
   * :return: The `findOne` method is returning the user information for the user with the specified
   * `id`. This information includes the user's identification, address, contact details, social
   * profiles, and meta data. If the user is not found, a `NotFoundException` is thrown with the
   * message 'User not found!'. If any other error occurs during the process, a `BadRequestException`
   * is thrown with the error
   */
  async findOne(id: string) {
    try {
      const userInfo = await this.userRepository.findOne({
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
      return userInfo;
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message, error.statusC);
    }
  }

  /**
   * The update function in TypeScript updates a user entity in the database with new data while ensuring
   * certain fields are not modified.
   *
   * :param id: The `id` parameter in the `update` function is a string that represents the unique
   * identifier of the user you want to update in the database. This identifier is used to locate the
   * specific user record that needs to be updated
   * :type id: string
   * :param updateUserDto: The `updateUserDto` parameter is an object that contains the data to update
   * for a user. In the provided code snippet, it is used to update a user entity in the database. The
   * code checks if the `updateUserDto` object contains certain properties like `password` or
   * `organization_id
   * :type updateUserDto: UpdateUserDto
   * :return: The `update` method is returning a Promise that resolves to a `User` object after updating
   * the user data in the database.
   */
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

  async delete(id: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: { meta_data: true },
      });

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      // Update the meta_data for soft delete
      user.meta_data.is_deleted = true;
      user.meta_data.deleted_on = new Date();

      // Save the updated user back to the database
      await this.userRepository.save(user);
      loggernaut.info(`User with ID ${id} has been soft deleted.`);
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
