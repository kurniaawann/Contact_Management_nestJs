import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterUserRequest, UserResponse } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { UserService } from './user.service';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @HttpCode(201)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.registerService(request);
    return {
      data: result,
    };
  }
}
