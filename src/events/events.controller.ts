import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Controller('/events')
export class EventsController {
  private events: Event[] = [];
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    const eventToAdd: Event = {
      ...createEventDto,
      id: this.events[this.events.length - 1]?.id ? this.events[this.events.length - 1]?.id  + 1 : 1,
      when: new Date(createEventDto.when)
    }
    this.events = [...this.events, eventToAdd];
    return this.events;
  }

  @Get()
  findAll() {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.events.find((event) => event.id === +id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    const eventToUpdate = this.events.find(event => event.id === +id);
    if(eventToUpdate) {
      const updatedEvent = {
        ...eventToUpdate,
        ...updateEventDto,
        when: eventToUpdate.when ? new Date(eventToUpdate.when) : eventToUpdate.when
      }
      this.events[this.events.findIndex(e => e.id === +id)] = updatedEvent
      return updatedEvent
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.events = this.events.filter((event) => event.id !== +id);
    return this.events;
  }
}
