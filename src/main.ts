import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys:['7c21f941c1ad48cca97d76291db4181f']
  }))
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, enableDebugMessages: true }),
  );
  await app.listen(3000);
}
bootstrap();
