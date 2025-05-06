import { Resend } from 'resend';
import { RESEND_TOKEN } from '@config/env';


interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailParams): Promise<boolean> => {
  try {
    const resend = new Resend(RESEND_TOKEN);

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject,
        html
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}; 