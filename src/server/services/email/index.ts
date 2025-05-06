import { sendEmail } from './sendEmail';
import { createVerificationEmailTemplate } from './html/emailTemplates';

export const sendVerificationEmail = async (email: string, code: string): Promise<boolean> => {
  return await sendEmail({
    to: email,
    subject: 'Verify Your Email',
    html: createVerificationEmailTemplate({ code })
  });
};


export const emailService = {
  sendVerificationEmail,
};

export default emailService;