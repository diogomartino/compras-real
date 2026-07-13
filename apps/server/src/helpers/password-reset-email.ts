import { logger } from '@myapp/logger';
import { Resend } from 'resend';

const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    if (process.env.NODE_ENV === 'production') {
      logger.error('Password reset email is not configured');
      throw new Error('Password reset email is not configured');
    }

    logger.info(`Password reset link for ${email}: ${resetUrl}`);
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your Compras Real password',
    text: `Reset your password using this link: ${resetUrl}`,
    html: `<p>Reset your password using this link:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
  });
};

export { sendPasswordResetEmail };
