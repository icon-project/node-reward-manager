import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);
  getHello(): string {
    // Log with level warn
    this.logger.log({
      level: 'warn',
      message: 'This is warn level',
      refCode: '1234',
    });

    // Log with level info
    this.logger.log({
      level: 'info',
      message: 'This is Info level',
      refCode: '1235',
    });

    try {
      throw new Error('random error');
    } catch (err) {
      // pass err to print stack trace
      this.logger.error({
        level: 'error',
        message: 'This is error level',
        refCode: '1236',
        error: err,
        errCustomCode: '1237',
      });
    }
    return 'Hello World!';
  }
}
