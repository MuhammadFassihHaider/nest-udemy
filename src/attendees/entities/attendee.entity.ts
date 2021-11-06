import { Event } from '../../events/entities/event.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Event, (event) => event.attendee, {
    nullable: false,
  })
  @JoinColumn({
    name: 'eventid',
  })
  event: Event;
}
