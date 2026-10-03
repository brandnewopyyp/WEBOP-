import emailjs from '@emailjs/browser';

export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export const DEFAULT_EMAILJS_SERVICE_ID = 'service_nrbio1l';
export const DEFAULT_EMAILJS_TEMPLATE_ID = 'template_cow2tol';
export const DEFAULT_EMAILJS_PUBLIC_KEY = 'iUU8p3bKZQQcSnh6Q';

export function getStoredEmailConfig(): EmailConfig {
  if (typeof window === 'undefined') {
    return {
      serviceId: DEFAULT_EMAILJS_SERVICE_ID,
      templateId: DEFAULT_EMAILJS_TEMPLATE_ID,
      publicKey: DEFAULT_EMAILJS_PUBLIC_KEY
    };
  }
  return {
    serviceId:
      localStorage.getItem('webop_emailjs_service_id') ||
      (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) ||
      DEFAULT_EMAILJS_SERVICE_ID,
    templateId:
      localStorage.getItem('webop_emailjs_template_id') ||
      (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) ||
      DEFAULT_EMAILJS_TEMPLATE_ID,
    publicKey:
      localStorage.getItem('webop_emailjs_public_key') ||
      (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string) ||
      DEFAULT_EMAILJS_PUBLIC_KEY
  };
}

export function saveStoredEmailConfig(config: EmailConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('webop_emailjs_service_id', config.serviceId.trim());
  localStorage.setItem('webop_emailjs_template_id', config.templateId.trim());
  localStorage.setItem('webop_emailjs_public_key', config.publicKey.trim());
}

export async function sendOtpToGmail(
  toEmail: string,
  otpCode: string
): Promise<{ success: boolean; isRealEmailSent: boolean; message: string }> {
  const config = getStoredEmailConfig();

  // If real EmailJS / Gmail service is configured
  if (config.serviceId && config.templateId && config.publicKey) {
    try {
      const templateParams = {
        to_email: toEmail,
        email: toEmail,
        user_email: toEmail,
        recipient: toEmail,
        otp_code: otpCode,
        code: otpCode,
        passcode: otpCode,
        app_name: 'webop',
        time: new Date().toLocaleTimeString()
      };

      const response = await emailjs.send(
        config.serviceId,
        config.templateId,
        templateParams,
        config.publicKey
      );

      if (response.status === 200) {
        return {
          success: true,
          isRealEmailSent: true,
          message: `Код таны Gmail (${toEmail}) хаяг руу бодитоор илгээгдлээ! Inbox болон Spam хавтсаа шалгана уу.`
        };
      }
    } catch (err: any) {
      console.error('EmailJS send error:', err);
      return {
        success: false,
        isRealEmailSent: false,
        message: err?.text || 'Имэйл илгээхэд алдаа гарлаа. Тохиргоогоо шалгана уу.'
      };
    }
  }

  return {
    success: false,
    isRealEmailSent: false,
    message: 'Gmail холболтын түлхүүр дутуу байна.'
  };
}
