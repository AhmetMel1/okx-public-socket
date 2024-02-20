import { NestFactory } from '@nestjs/core';
import { AppModule } from './module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(process.env.PORT);
}
bootstrap();
