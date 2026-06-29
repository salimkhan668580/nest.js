import { NestFactory } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  app.useGlobalPipes(new ValidationPipe());
  const connection = app.get<Connection>(getConnectionToken());

  if (connection.readyState === ConnectionStates.connected) {
    console.log('✅ MongoDB Connected');
  } else {
    connection.once('connected', () => console.log('MongoDB connected'));
  }

  await app.listen(port);
  console.log(`✅ Server started on port ${port}`);
}
void bootstrap();
