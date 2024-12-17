import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class Task1Service {
  private readonly logger = new Logger(Task1Service.name);

  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}
