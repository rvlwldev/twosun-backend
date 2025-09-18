import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ClassSerializerInterceptor } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { DataSource } from 'typeorm';
import { Reflector } from '@nestjs/core';

interface TestSetup {
  app: INestApplication;
  dataSource: DataSource;
}

export const setupAppTest = async (): Promise<TestSetup> => {
  const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();

  const app = module.createNestApplication();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.init();

  return { app, dataSource: app.get(DataSource) };
};

export const teardownTest = async (app: INestApplication) => await app.close();

export const initDatabase = async (dataSource: DataSource) => {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE ${entity.tableName}`);
  }
};
