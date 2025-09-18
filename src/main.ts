import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const description = `
  TypeScript + NestJS 으로 요구사항을 구현합니다.
  MySQL8, TypeORM을 사용하여 구현했습니다.
  `;

  const config = new DocumentBuilder()
    .setTitle('Xnet 백엔드 소셜 미디어 피드 개발 과제')
    .setDescription(description)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
