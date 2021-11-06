import { registerAs } from '@nestjs/config';
import { Attendee } from 'src/attendees/entities/attendee.entity';
import { Subject } from 'src/school/subject.entity';
import { Teacher } from 'src/school/teacher.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Event } from '../events/entities/event.entity';

export default registerAs(
  'orm-config',
  (): PostgresConnectionOptions => ({
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'nest-ude',
    entities: [Event, Attendee, Subject, Teacher],
    synchronize: true,
  }),
);
