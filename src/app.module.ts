import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ormConfig],
    }),
    EventsModule,
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV === 'production' ? ormConfigProd : ormConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
