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
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
  /**
   * The function `registerUser` takes a `RegisterUserDto` object, creates a new user entity with the
   * provided data, and saves it to the database, returning a `CreateUserResponseDto`.
   *
   * @param RegisterUserDto registerUserDto The `registerUserDto` parameter in the `registerUser`
   * function contains the following properties:
   *
   * @return The `registerUser` function is returning a Promise that resolves to a
   * `CreateUserResponseDto` object. This object likely contains information about the user that was
   * created, such as their ID or other relevant details.
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

  /**
   * The function creates a new user by setting the password, merging user data, creating a user
   * object, and saving it to the repository.
   *
   * @param CreateUserDto createUserDto The `createUserDto` parameter in the `createUser` function
   * likely represents a data transfer object (DTO) containing information needed to create a new user.
   * It may include properties such as `username`, `email`, `password`, `firstName`, `lastName`, etc.
   * This object is used to
   *
   * @return The `createUser` function returns a Promise that resolves to a `CreateUserResponseDto`
   * object. This object represents the user that was created and saved in the database.
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
   * search criteria, and returns a response with user data and counts.
   *
   * @param PaginationQueryParams queryParams The `getUserList` function you provided is an
   * asynchronous function that retrieves a list of users based on the pagination query parameters
   * passed to it. The function performs a database query to fetch users with optional search criteria
   * and pagination settings.
   *
   * @return The function `getUserList` returns a Promise that resolves to a `UserListResponseDto`
   * object. This object contains the following properties:
   * - `totalCount`: Total count of users in the database.
   * - `filterCount`: Count of users after applying the pagination filters.
   * - `userList`: An array of user objects that match the pagination criteria.
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
          'first_name ILIKE :search OR last_name ILIKE :search OR email ILIKE :search AND meta_data.is_deleted = :deleted',
          { search: `%${search}%`, deleted: false },
        );
      } else {
        query.where('meta_data.is_deleted = :deleted', { deleted: false });
      }
      const totalCount = await this.userRepository.count();

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

  /**
   * This TypeScript function asynchronously finds a user by their ID, fetching related information and
   * handling exceptions appropriately.
   *
   * @param string id The `findOne` function you provided is an asynchronous function that retrieves
   * user information based on the provided `id`. The function uses the `userRepository` to find a user
   * with the specified `id` and includes related entities such as identification, address, contact,
   * social profiles, and meta data.
   *
   * @return The `findOne` method is returning the user information for the user with the specified
   * `id`. If the user is found, the method returns the user information object. If the user is not
   * found, a `NotFoundException` is thrown with the message 'User not found!'. If any other error
   * occurs during the process, a `BadRequestException` is thrown with the error message and status
   * code.
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
   * The function updates a user in a database, ensuring that certain fields cannot be modified and
   * handling exceptions appropriately.
   *
   * @param string id The `id` parameter in the `update` function is a string that represents the
   * unique identifier of the user you want to update. This identifier is used to find the user in the
   * database so that the update operation can be performed on the correct user record.
   * @param UpdateUserDto updateUserDto The `updateUserDto` parameter is an object that contains the
   * data to update for a user. In the provided code snippet, it is checked for the presence of certain
   * properties (`password` and `organization_id`) to ensure that these properties are not allowed to
   * be updated. If either of these properties
   *
   * @return The `update` method is returning a Promise that resolves to a `User` object after updating
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

  /**
   * The function `delete` asynchronously soft deletes a user by updating metadata and saving the changes
   * to the database.
   *
   * @param string id The `id` parameter in the `delete` method is a string that represents the unique
   * identifier of the user that needs to be deleted.
   */
  async delete(id: string): Promise<User> {
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
      loggernaut.info(`User with ID ${id} has been soft deleted.`);
      return await this.userRepository.save(user);
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async findUserByIdentity(userIdentity: string) {
    try {
      let userInfo;
      if (uuidValidate(userIdentity)) {
        userInfo = await this.userRepository.findOne({
          where: {
            id: userIdentity,
          },
        });
      } else {
        userInfo = await this.userRepository.findOneOrFail({
          where: [
            {
              email: userIdentity,
            },
            {
              username: userIdentity,
            },
          ],
        });
      }
      if (!userInfo) {
        throw new NotFoundException(
          'User with the email/username does not exist',
        );
      }
      return userInfo;
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
