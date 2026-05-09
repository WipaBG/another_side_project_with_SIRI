import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3000);
  const host = '127.0.0.1';

  await app.listen(port, host);
  console.log(`Summer villa Siri API running on http://${host}:${port}`);
}

bootstrap();
