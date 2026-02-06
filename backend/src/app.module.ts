import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatsModule } from './stats/stats.module';
import { StatsController } from './stats/stats.controller';
import { StatsService } from './stats/stats.service';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

// Throttler
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'reizonr1',
      database: 'sociappdb', // Asegúrate de que coincida con tu BD local
      entities: [],
      synchronize: false,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]),
    StatsModule,
    UsersModule,
  ],
  controllers: [AppController, StatsController, UsersController],
  providers: [AppService, StatsService, UsersService],
})
export class AppModule {}
