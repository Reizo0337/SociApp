import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from '../users/user.entity';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        @InjectRepository(Usuarios)
        private readonly userRepository: Repository<Usuarios>,
    ) { }

    async sendMail(to: string | string[], subject: string, message: string) {
        try {
            await this.mailerService.sendMail({
                to,
                subject,
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                ${message.replace(/\n/g, '<br>')}
              </div>`,
            });
            return { success: true, message: 'Correo enviado correctamente' };
        } catch (error) {
            console.error('Error sending mail:', error);
            throw error;
        }
    }

    async sendToAllSocios(subject: string, message: string) {
        const socios = await this.userRepository.find({ where: { socio: 'Socio' } });
        const emails = socios.map(s => s.email).filter(e => e);

        if (emails.length === 0) {
            return { success: false, message: 'No hay socios con email configurado' };
        }

        return this.sendMail(emails, subject, message);
    }
}
