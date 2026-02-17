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
            const professionalBody = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                
                <!-- Header -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9; padding:20px;">
                    <tr>
                        <td width="60" valign="middle">
                        <img src="https://i.imgur.com/3p0Wvnr.png" alt="Logo" style="height:50px; display:block;" />
                        </td>
                        <td valign="middle" style="padding-left:15px; font-family: Arial, sans-serif; font-size:24px; color:#333;">
                        SociApp
                        </td>
                    </tr>
                </table>
                <hr style="border:none; border-top:1px solid #ccc; margin:0;" />
                <div style="padding: 20px; line-height: 1.6;">
                    <p><b>Estimado Socio,</b></p>

                    <p>${message.replace(/\n/g, '<br>')}</p>
                </div>

                <!-- Footer -->
                <div style="padding: 15px 20px; font-size: 12px; color: #888; background-color: #f9f9f9; text-align: center;">
                    Este correo electrónico se ha enviado automáticamente, por favor no responda a este mensaje.<br/>
                    &copy; ${new Date().getFullYear()} SociApp. Todos los derechos reservados.
                </div>
            </div>
            `;

            await this.mailerService.sendMail({
                to,
                subject,
                html: professionalBody,
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

    async sendVerificationCode(to: string, code: string) {
        const subject = 'Código de verificación - SociApp';
        const message = `Su código de verificación es: <b>${code}</b>. Este código expirará en 15 minutos.`;

        try {
            const html = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9; padding:20px;">
                    <tr>
                        <td width="60" valign="middle">
                        <img src="https://i.imgur.com/3p0Wvnr.png" alt="Logo" style="height:50px; display:block;" />
                        </td>
                        <td valign="middle" style="padding-left:15px; font-family: Arial, sans-serif; font-size:24px; color:#333;">
                        SociApp
                        </td>
                    </tr>
                </table>
                <hr style="border:none; border-top:1px solid #ccc; margin:0;" />
                <div style="padding: 30px; line-height: 1.6; text-align: center;">
                    <h2 style="color: #333;">Verifica tu cuenta</h2>
                    <p>Hola, utiliza el siguiente código para completar tu registro:</p>
                    <div style="background: #f4f4f4; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; margin: 20px 0; color: var(--button-primary, #20a8d8);">
                        ${code}
                    </div>
                    <p style="color: #666; font-size: 14px;">Este código expirará en 15 minutos.</p>
                </div>
                <div style="padding: 15px 20px; font-size: 12px; color: #888; background-color: #f9f9f9; text-align: center;">
                    Este correo electrónico se ha enviado automáticamente, por favor no responda a este mensaje.<br/>
                    &copy; ${new Date().getFullYear()} SociApp. Todos los derechos reservados.
                </div>
            </div>
            `;

            await this.mailerService.sendMail({
                to,
                subject,
                html,
            });

            return { success: true };
        } catch (error) {
            console.error('Error sending verification mail:', error);
            throw error;
        }
    }
}
