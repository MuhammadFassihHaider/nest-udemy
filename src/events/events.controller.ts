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
import { EventsService } from './events.service';

@Controller('/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  async findAll() {
    return this.eventsService.findAll();
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

  // @Get('practice/:id')
  // async practice(@Param('id', ParseIntPipe) id: number) {
  //   const event = await this.repository.findOne(id, {
  //     relations: ['attendee'],
  //   });

  //   if (!event) {
  //     throw new NotFoundException();
  //   }

  //   return event;
  // }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const foundResult = await this.eventsService.findOne(id);
    if (!foundResult) {
      throw new NotFoundException();
    }
    return foundResult;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const updateResult = await this.eventsService.update(id, updateEventDto);
    if (updateResult?.affected === 0) {
      throw new NotFoundException();
    }

    return updateResult;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleteResult = await this.eventsService.remove(id);

    if (deleteResult?.affected === 0) {
      throw new NotFoundException();
    }

    return deleteResult;
  }
}
