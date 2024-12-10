import { Module } from '@nestjs/common';
import { CommanModule } from './comman/comman.module';

@Module({
  imports: [CommanModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
