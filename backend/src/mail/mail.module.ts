import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from '../users/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Usuarios])],
    controllers: [MailController],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
