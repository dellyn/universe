interface VerificationTemplateProps {
  code: string;
}

export const createVerificationEmailTemplate = ({ code }: VerificationTemplateProps): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Email Verification</h1>
      <p>Thank you for registering to GitHub CRM. Please use the following code to verify your email address:</p>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
        ${code}
      </div>
      <p>This verification code will expire in 30 minutes.</p>
      <p>If you did not request this verification, please ignore this email.</p>
    </div>
  `;
};
