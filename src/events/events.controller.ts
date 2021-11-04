import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Controller('/events')
export class EventsController {
  private events: Event[] = [];
  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
  ) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    console.log(createEventDto, 'here');
    return await this.repository.save({
      ...createEventDto,
      when: new Date(createEventDto.when),
    });
  }

  @Get()
  async findAll() {
    return this.repository.find();
  }

  // @Get('practice')
  // async practice() {
  //   return await this.repository.find({
  //     select: ['name', 'address', 'id'],

  //     where: {
  //       id: MoreThan(2),
  //     },
  //   });
  // }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(typeof id);
    return this.repository.findOneOrFail(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const eventToUpdate = await this.repository.findOne(+id);
    if (!eventToUpdate) {
      throw Error('Could not find event to update!');
    }
    if (eventToUpdate) {
      return this.repository.save({
        ...eventToUpdate,
        ...updateEventDto,
        when: eventToUpdate.when
          ? new Date(eventToUpdate.when)
          : eventToUpdate.when,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const eventToDelete = await this.repository.findOne(+id);

    if (eventToDelete) {
      return this.repository.remove(eventToDelete);
    }
  }
}
