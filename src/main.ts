import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { Logging } from './core/custom-logger';

async function bootstrap() {
  const customLoggerService = new Logging();
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(customLoggerService.createLoggerConfig),
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
