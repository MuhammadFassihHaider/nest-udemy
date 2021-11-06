import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
  ) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
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

  @Get('practice/:id')
  async practice(@Param('id', ParseIntPipe) id: number) {
    const event = await this.repository.findOne(id, {
      relations: ['attendee'],
    });

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.repository.findOneOrFail(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const eventToUpdate = await this.repository.findOne(+id);
    if (!eventToUpdate) {
      throw new NotFoundException();
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
    if (!eventToDelete) {
      throw new NotFoundException();
    }
    if (eventToDelete) {
      return this.repository.remove(eventToDelete);
    }
  }
}
