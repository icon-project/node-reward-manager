import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { Task1Service } from './tasks/task-1.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, Task1Service],
})
export class AppModule {}
