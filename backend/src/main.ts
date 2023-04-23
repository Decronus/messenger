import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 3005;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
}
bootstrap();
