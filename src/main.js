import { Client, Account } from 'node-appwrite'
import nodemailer from 'nodemailer'

// This is the Appwrite Function code
// Deploy this as an Appwrite Function to handle email sending

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '')

  try {
    // Parse the request data
    const data = JSON.parse(req.body.data || '{}')
    const { to, name, subject, message } = data

    if (!to || !name) {
      return res.json({
        success: false,
        error: 'Email and name are required',
      }, 400)
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #ffffff;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #0062ff;
              margin-bottom: 10px;
            }
            .content {
              margin-bottom: 30px;
            }
            .message {
              background: #f8f9fa;
              border-left: 4px solid #0062ff;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #666;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: #0062ff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Fairlx</div>
              <h2 style="color: #333; margin: 0;">Thank You for Reaching Out!</h2>
            </div>
            
            <div class="content">
              <p>Hi ${name},</p>
              
              <div class="message">
                <strong>We've received your feedback. We'll contact you soon.</strong>
              </div>
              
              <p>
                Our team will review your message and get back to you as quickly as possible. 
                We typically respond within 24-48 hours during business days.
              </p>
              
              <p>
                In the meantime, feel free to explore our documentation and resources:
              </p>
              
              <p style="text-align: center;">
                <a href="https://fairlx.com/docs" class="button">Visit Documentation</a>
              </p>
              
              <p>
                If you have any urgent questions, you can also reach us at 
                <a href="mailto:support@fairlx.com" style="color: #0062ff;">support@fairlx.com</a>
              </p>
            </div>
            
            <div class="footer">
              <p>
                This email was sent by Fairlx<br>
                You're receiving this because you submitted a contact form on our website.
              </p>
              <p>
                &copy; ${new Date().getFullYear()} Fairlx. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email
    const info = await transporter.sendMail({
      from: `"Fairlx Support" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: to,
      subject: subject || 'Thank you for contacting Fairlx',
      html: htmlContent,
      text: `Hi ${name},\n\n${message}\n\nBest regards,\nThe Fairlx Team`,
    })

    log('Email sent successfully:', info.messageId)

    return res.json({
      success: true,
      messageId: info.messageId,
    })
  } catch (err) {
    error('Error sending email:', err)
    return res.json({
      success: false,
      error: err.message,
    }, 500)
  }
}
