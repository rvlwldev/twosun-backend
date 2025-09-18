import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';

let db: StartedMySqlContainer;

beforeAll(async () => {
  db = await new MySqlContainer('mysql:8.4.4')
    .withDatabase('testdb')
    .withUsername('test')
    .withRootPassword('test')
    .start();

  process.env.MYSQL_HOST = db.getHost();
  process.env.MYSQL_PORT = String(db.getMappedPort(3306));
  process.env.MYSQL_DATABASE = db.getDatabase();
  process.env.MYSQL_USER = db.getUsername();
  process.env.MYSQL_PASSWORD = db.getUserPassword();
}, 60_000);

afterAll(async () => await db.stop(), 30_000);
