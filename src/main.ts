import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { CategoryService } from '@/modules/categories/category.service';
import { SEED_CATEGORIES } from '@/modules/categories/category.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const description = `
  TypeScript + NestJS 으로 요구사항을 구현합니다.
  MySQL8, TypeORM을 사용하여 구현했습니다.
  `;

  const config = new DocumentBuilder()
    .setTitle('Xnet 백엔드 소셜 미디어 피드 개발 과제')
    .setDescription(description)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  console.log('Seeding categories...');
  const categoryService = app.get(CategoryService);
  const categories = await categoryService.findAll();
  const categoryNames = new Set(categories.map((cat) => cat.name));
  for (const seedCategory of SEED_CATEGORIES)
    if (!categoryNames.has(seedCategory.name!))
      await categoryService
        .createCategory(seedCategory.name!)
        .then((category) => console.log(`Category added (${category.name})`));

  console.log('Category seeding complete.');

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
