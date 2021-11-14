import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EAttendeeStatus } from 'src/attendees/entities/attendee.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
  ) {}

  private baseQuery() {
    return this.repository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  public getEventsWithAttendeeCountQuery() {
    return this.baseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendee')
      .loadRelationCountAndMap(
        'e.attendeeAccepted', //virtual column in which to store the result
        'e.attendee', // the relation to load
        'attendee', // alias
        (qb) =>
          qb.where('attendee.attendingStatus = :attending', {
            attending: EAttendeeStatus.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendee',
        'attendee',
        (qb) =>
          qb.where('attendee.attendingStatus = :attending', {
            attending: EAttendeeStatus.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendee',
        'attendee',
        (qb) =>
          qb.where('attendee.attendingStatus = :attending', {
            attending: EAttendeeStatus.Rejected,
          }),
      );
  }

  async create(createEventDto: CreateEventDto) {
    return await this.repository.save({
      ...createEventDto,
      when: new Date(createEventDto.when),
    });
  }

  async findAll(): Promise<Event[]> {
    return await this.baseQuery().getMany();
  }

  async findOne(id: number): Promise<Event> {
    const query = this.getEventsWithAttendeeCountQuery().andWhere(
      'e.id = :id',
      { id },
    );
    this.logger.debug(query.getSql());
    return await query.getOne();
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return this.repository
      .createQueryBuilder('e')
      .update({ ...updateEventDto })
      .where('id = :id', { id })
      .execute();
  }

  async remove(id: number) {
    return await this.repository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
