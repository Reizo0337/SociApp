import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatsModule } from './stats/stats.module';
import { UsersModule } from './users/users.module';
import { ActivitiesModule } from './activities/activities.module';
import { ProjectModule } from './projects/project.module';
import { AuthModule } from './auth/auth.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';

import { Usuarios as User } from './users/user.entity';

// Throttler
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfiguracionModule } from './configuracion/configuracion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../.env')
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'noreplysociapp@gmail.com',
          pass: process.env.SMTP_PASSWORD
        },
      },
      defaults: {
        from: '"SociApp" <noreplysociapp@gmail.com>',
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]),
    StatsModule,
    UsersModule,
    ActivitiesModule,
    ProjectModule,
    AuthModule,
<<<<<<< HEAD
    ConfiguracionModule
=======
    MailModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
>>>>>>> 527857a7643d5306024eb5a44450cf7af8f44d05

    // Otros módulos

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
