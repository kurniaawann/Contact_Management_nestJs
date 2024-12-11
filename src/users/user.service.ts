import { HttpException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/comman/prisma.service';
import { ValidationService } from 'src/comman/validation.service';
import { RegisterUserRequest, UserResponse } from 'src/model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}
  async registerService(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Register new user ${JSON.stringify(request)}`);

    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername != 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.username,
    };
  }
}
