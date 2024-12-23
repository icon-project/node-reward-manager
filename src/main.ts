import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { Logging } from './core/custom-logger';
import { AppService } from './app.service';

async function bootstrap() {
  const customLoggerService = new Logging();
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: WinstonModule.createLogger(customLoggerService.createLoggerConfig),
  });
  const appService = app.get(AppService);

  appService.cronJob();
}
bootstrap();
