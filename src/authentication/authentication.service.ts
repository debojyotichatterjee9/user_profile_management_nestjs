import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthenticationService {
  conststructor(
    private readonly userService: UserService
  ){}
}
