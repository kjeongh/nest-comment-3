import { initializeTransactionalContext } from 'typeorm-transactional';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {
  GlobalExceptionFilter,
  ValidationExceptionFilter,
} from './common/filters/exception.filter';
import { ValidationException } from './common/error/exceptions/validation.exception';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 데코레이터 없는 속성 제거
      // forbidNonWhiteListed: true,
      transform: true, // 타입 변환
      exceptionFactory: (errors) => {
        throw new ValidationException(errors);
      },
    }),
  );
  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new ValidationExceptionFilter(),
  );
  await app.listen(process.env.PORT || 8000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
