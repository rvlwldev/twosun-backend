require('tsconfig-paths/register');

import { MySqlContainer } from '@testcontainers/mysql';
import { DataSource } from 'typeorm';
import bcrypt from 'bcrypt';

import { TEST_SEED_USERS, TEST_SEED_CATEGORIES } from './seed.data';
import { User } from '@/modules/users/user.entity';
import { Category } from '@/modules/categories/category.entity';
import { Tweet } from '@/modules/tweets/entities/tweet.entity';
import { TweetLike } from '@/modules/tweets/entities/tweet-like.entity';
import { TweetImage } from '@/modules/tweets/entities/tweet-image.entity';
import { Comment } from '@/modules/comments/comment.entity';

module.exports = async () => {
  console.log('\nStarting MySQL container...');

  const db = await new MySqlContainer('mysql:8.4.4')
    .withDatabase('test-db')
    .withUsername('test')
    .withRootPassword('test')
    .start();

  process.env.NODE_ENV = 'test';
  process.env.MYSQL_HOST = db.getHost();
  process.env.MYSQL_PORT = db.getPort().toString();
  process.env.MYSQL_USER = 'root';
  process.env.MYSQL_PASSWORD = db.getRootPassword();
  process.env.MYSQL_DATABASE = db.getDatabase();

  (global as any).__MYSQL_CONTAINER__ = db;
  console.log('MySQL container started.');

  console.log('connecting to MySQL');
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT, 10),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [User, Category, Tweet, TweetImage, TweetLike, Comment],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  console.log('Data seeding...');
  const userRepository = dataSource.getRepository(User);
  for (const userData of TEST_SEED_USERS) {
    const user = userRepository.create({ ...userData });
    await userRepository.save(user);
  }
  console.log(`${TEST_SEED_USERS.length} users seeded.`);

  const categoryRepository = dataSource.getRepository(Category);
  for (const categoryData of TEST_SEED_CATEGORIES) {
    const category = categoryRepository.create(categoryData);
    await categoryRepository.save(category);
  }
  console.log(`${TEST_SEED_CATEGORIES.length} categories seeded.`);

  await dataSource.destroy();
};
