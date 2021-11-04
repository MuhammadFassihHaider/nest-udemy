import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Event } from '../events/entities/event.entity';

export default (): PostgresConnectionOptions => ({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'nest-ude',
  entities: [Event],
  synchronize: false,
});
