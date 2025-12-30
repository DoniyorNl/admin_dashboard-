import nodemailer from 'nodemailer'

// Email konfiguratsiyasi
export const emailConfig = {
	host: process.env.SMTP_HOST || 'smtp.gmail.com',
	port: parseInt(process.env.SMTP_PORT || '587'),
	secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.SMTP_USER, // Gmail manzilingiz
		pass: process.env.SMTP_PASSWORD, // Gmail App Password
	},
}

// Transporter yaratish
export function createEmailTransporter() {
	return nodemailer.createTransport(emailConfig)
}

// Password reset email yuborish
export async function sendPasswordResetEmail(
	to: string,
	userName: string,
	newPassword: string,
): Promise<boolean> {
	try {
		const transporter = createEmailTransporter()

		const mailOptions = {
			from: `"${process.env.SMTP_FROM_NAME || 'Admin Dashboard'}" <${process.env.SMTP_USER}>`,
			to: to,
			subject: '🔐 Password Reset - Admin Dashboard',
			html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🔐 Password Reset</h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                Hello <strong>${userName}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                We received a request to reset your password. Your new temporary password has been generated:
                            </p>
                            
                            <!-- Password Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #f8f9fa; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center;">
                                        <p style="margin: 0 0 10px 0; color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your New Password</p>
                                        <p style="margin: 0; color: #333333; font-size: 24px; font-weight: bold; font-family: 'Courier New', monospace; letter-spacing: 2px;">
                                            ${newPassword}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Warning Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px;">
                                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                                            ⚠️ <strong>Important:</strong> Please change this password immediately after logging in. Go to Settings → Security → Change Password.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                If you didn't request this password reset, please contact support immediately.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 10px 10px; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                                This is an automated message, please do not reply to this email.
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                © ${new Date().getFullYear()} Admin Dashboard. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
			text: `
Hello ${userName},

We received a request to reset your password. Your new temporary password is:

${newPassword}

⚠️ Important: Please change this password immediately after logging in.
Go to Settings → Security → Change Password.

If you didn't request this password reset, please contact support immediately.

© ${new Date().getFullYear()} Admin Dashboard. All rights reserved.
            `,
		}

		const info = await transporter.sendMail(mailOptions)
		console.log('Email sent successfully:', info.messageId)
		return true
	} catch (error) {
		console.error('Email sending failed:', error)
		return false
	}
}
