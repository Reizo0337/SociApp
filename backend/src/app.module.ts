import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatsModule } from './stats/stats.module';
import { UsersModule } from './users/users.module';
import { ActivitiesModule } from './activities/activities.module';


import { Usuarios as User } from './users/user.entity';

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
      entities: [User],
      synchronize: false,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]),
    StatsModule,
    UsersModule,
    ActivitiesModule,
    // Otros módulos
    
  ],
  controllers: [AppController],
  providers: [AppService], 
})
export class AppModule {}
