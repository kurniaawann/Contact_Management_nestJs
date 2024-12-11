import { Module } from '@nestjs/common';
import { CommanModule } from './comman/comman.module';
import { UserModule } from './users/user.module';
import { UserService } from './users/user.service';

@Module({
  imports: [CommanModule, UserModule],
  controllers: [],
  providers: [UserService],
})
export class AppModule {}
