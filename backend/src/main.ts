import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for multiple origins from environment variables
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  const origins = frontendUrl.split(',').map((origin) => origin.trim());

  app.enableCors({
    origin: origins.length > 1 ? origins : origins[0],
    credentials: true, // Allow cookies, authorization headers, etc.
  });

  // 미들웨어 같은것. 요청들어와서 예를들어서 아티스트 정보 DB에 만들때 유효성검사
  app.useGlobalPipes(
    new ValidationPipe({
      // DTO에 있는 프로퍼티만 허용
      whitelist: true,
      // DTO에 없는 프로퍼티가 들어오면 에러발생
      forbidNonWhitelisted: true,
      // number가 문자로 들어와도 자동으로 변환해줌 (url에 파라미터는 다 문자로 들어옴)
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap(); // Added void operator
