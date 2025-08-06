const nodemailer = require('nodemailer');

// Create email transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Gmail App Password
    },
  });
};

const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();

    // Create reset URL - points to backend server with the HTML page
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
      from: {
        name: 'Todo App',
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: '🔐 Reset Your Password - Todo App',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 2em;
              margin-bottom: 10px;
            }
            h1 {
              color: #6200EE;
              margin: 0;
            }
            .button {
              display: inline-block;
              background-color: #6200EE;
              color: #F5F5F5!important;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .warning {
              background-color: #FFF3E0;
              border: 1px solid #FFB74D;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 0.9em;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✅</div>
              <h1>Reset Your Password</h1>
            </div>
            
            <p>Hello,</p>
            
            <p>You requested to reset your password for your Todo App account. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}"  class="button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #F5F5F5; padding: 10px; border-radius: 5px; font-family: monospace;">
              ${resetUrl}
            </p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> This link will expire in 10 minutes for security reasons. If you didn't request this reset, please ignore this email.
            </div>
            
            <div class="footer">
              <p>Best regards,<br>Todo App Team</p>
              <p><small>If you're having trouble clicking the button, copy and paste the URL into your web browser.</small></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Todo App - Reset Your Password
        
        Hello,
        
        You requested to reset your password for your Todo App account.
        
        Click this link to reset your password: ${resetUrl}
        
        This link will expire in 10 minutes for security reasons.
        
        If you didn't request this reset, please ignore this email.
        
        Best regards,
        Todo App Team
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Password reset email sent successfully to:', email);
    console.log('📧 Message ID:', result.messageId);
    
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'Todo App',
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: '🎉 Welcome to Todo App!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Todo App</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #F5F5F5;
            }
            .container {
              background-color: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 3em;
              margin-bottom: 10px;
            }
            h1 {
              color: #6200EE;
              margin: 0;
            }
            .features {
              background-color: #F5F5F5;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .feature {
              margin: 10px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 0.9em;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎉</div>
              <h1>Welcome to Todo App!</h1>
            </div>
            
            <p>Hi ${name},</p>
            
            <p>Welcome to Todo App! We're excited to have you on board. Your account has been successfully created and you're ready to start organizing your tasks.</p>
            
            <div class="features">
              <h3>🚀 What you can do with Todo App:</h3>
              <div class="feature">✅ Create and manage tasks</div>
              <div class="feature">📅 Set due dates and reminders</div>
              <div class="feature">🏷️ Organize with categories and tags</div>
              <div class="feature">📊 Track your productivity with stats</div>
              <div class="feature">🎨 Customize your experience</div>
            </div>
            
            <p>Start by creating your first task and see how Todo App can help you stay organized and productive!</p>
            
            <div class="footer">
              <p>Happy organizing!<br><strong>Todo App Team</strong></p>
              <p><small>Need help? Reply to this email and we'll get back to you.</small></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Todo App!
        
        Hi ${name},
        
        Welcome to Todo App! We're excited to have you on board. Your account has been successfully created and you're ready to start organizing your tasks.
        
        What you can do with Todo App:
        - Create and manage tasks
        - Set due dates and reminders  
        - Organize with categories and tags
        - Track your productivity with stats
        - Customize your experience
        
        Start by creating your first task and see how Todo App can help you stay organized and productive!
        
        Happy organizing!
        Todo App Team
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Welcome email sent successfully to:', email);
    console.log('📧 Message ID:', result.messageId);
    
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
