import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('mail')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('send')
    @Roles('admin', 'monitor')
    async sendMail(
        @Body('to') to: string | string[],
        @Body('subject') subject: string,
        @Body('message') message: string,
    ) {
        return this.mailService.sendMail(to, subject, message);
    }

    @Post('send-all')
    @Roles('admin')
    async sendToAll(
        @Body('subject') subject: string,
        @Body('message') message: string,
    ) {
        return this.mailService.sendToAllSocios(subject, message);
    }
}
