import { Resend } from "resend";
import { env } from "../config/env";

interface SendOtpEmailParams {
  to: string;
  userName: string;
  otpCode: string;
  resetLink: string;
}

export const sendOtpResetEmail = async ({
  to,
  userName,
  otpCode,
  resetLink,
}: SendOtpEmailParams) => {
  if (!env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY is not configured in backend/.env. Email sending skipped.");
    return { success: false, error: "RESEND_API_KEY is not configured in backend/.env" };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const fromEmail = env.RESEND_FROM_EMAIL || "Real Nest <onboarding@resend.dev>";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
        .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,6,42,0.08); }
        .header { background-color: #00062A; padding: 32px 24px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
        .header span { color: #FF4C00; }
        .content { padding: 32px 28px; color: #334155; line-height: 1.6; }
        .otp-box { background: #fff5f0; border: 2px dashed #FF4C00; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 32px; font-weight: 900; color: #FF4C00; letter-spacing: 6px; margin: 0; font-family: monospace; }
        .otp-sub { font-size: 11px; color: #94a3b8; margin-top: 6px; font-weight: 700; text-transform: uppercase; }
        .btn-wrapper { text-align: center; margin: 28px 0; }
        .btn { display: inline-block; background-color: #FF4C00; color: #ffffff !important; font-weight: 800; font-size: 13px; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 14px rgba(255,76,0,0.3); text-transform: uppercase; letter-spacing: 0.5px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>REAL<span>NEST</span></h1>
        </div>
        <div class="content">
          <h2 style="color: #00062A; font-size: 18px; margin-top: 0;">Password Reset Verification</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>We received a request to reset the password for your account. Use the 6-digit OTP code below to complete your reset request:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otpCode}</div>
            <div class="otp-sub">Expires in 10 minutes</div>
          </div>

          <p>Alternatively, you can click the button below to visit the password reset page directly:</p>
          
          <div class="btn-wrapper">
            <a href="${resetLink}" class="btn">Reset Password Now</a>
          </div>

          <p style="font-size: 12px; color: #64748b; margin-top: 24px;">If you did not request a password reset, please ignore this email or contact support if you suspect unauthorized access.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Real Nest Real Estate Management. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: `🔑 ${otpCode} is your Real Nest password reset code`,
      html: htmlContent,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      return { success: false, error: error.message };
    }

    console.log("✉️ Password reset email sent via Resend:", data);
    return { success: true, data };
  } catch (error: any) {
    console.error("❌ Resend email failed:", error);
    return { success: false, error: error.message || "Failed to send email" };
  }
};
