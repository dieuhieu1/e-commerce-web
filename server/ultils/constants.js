const verifyEmailHTML = (verificationToken) => {
  return `
    <div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f6f8;
    margin: 0;
    padding: 40px 0;
    ">
    <div style="
    max-width: 600px;
    background: white;
    margin: auto;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    overflow: hidden;
    ">
    <!-- Header -->
    <div style="
    background: linear-gradient(135deg, #007bff, #00b4d8);
    color: white;
    text-align: center;
    padding: 30px 20px;
    ">
    <h1 style="margin: 0; font-size: 24px;">Verify Your Email Address</h1>
    </div>
    
    <!-- Body -->
    <div style="padding: 30px; text-align: left; color: #333;">
    <p style="font-size: 16px; margin-bottom: 20px;">
    Hello 👋,<br/>
    Thank you for registering with <strong>MyApp</strong>! Please click the button below to verify your email address.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
    <a href="${
      process.env.URL_SERVER
    }/api/user/verify-email/${verificationToken}"
        target="_blank"
        style="
        background-color: #007bff;
        color: white;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 6px;
        font-size: 16px;
        display: inline-block;
        font-weight: 500;
        ">
        ✅ Verify My Email
        </a>
        </div>
        
        <p style="font-size: 14px; color: #666;">
        This verification link will expire in <strong>10 minutes</strong>.
        <br/><br/>
        If you didn’t create an account, please ignore this message.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;"/>
        
        <p style="font-size: 12px; color: #999; text-align: center;">
        © ${new Date().getFullYear()} MyApp Inc. All rights reserved.
        </p>
        </div>
        </div>
        </div>
        `;
};
const forgotPasswordHTML = (resetToken) => {
  return `
    <div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f6f8;
    margin: 0;
    padding: 40px 0;
    ">
    <div style="
      max-width: 600px;
      background: white;
      margin: auto;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      overflow: hidden;
      ">
      <!-- Header -->
      <div style="
      background: linear-gradient(135deg, #ff7b00, #ffb703);
      color: white;
      text-align: center;
      padding: 30px 20px;
      ">
      <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
      </div>
      
      <!-- Body -->
      <div style="padding: 30px; text-align: left; color: #333;">
      <p style="font-size: 16px; margin-bottom: 20px;">
      Hello 👋,<br/>
      We received a request to reset your password for your <strong>MyApp</strong> account.
      Click the button below to set a new password.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.CLIENT_URL}/forgot-password/${resetToken}"
      target="_blank"
      style="
      background-color: #ff7b00;
      color: white;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-size: 16px;
      display: inline-block;
      font-weight: 500;
      ">
      🔐 Reset My Password
      </a>
      </div>
      
      <p style="font-size: 14px; color: #666;">
      This password reset link will expire in <strong>15 minutes</strong>.
      <br/><br/>
      If you didn’t request this, please ignore this email — your password will remain unchanged.
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;"/>
      
      <p style="font-size: 12px; color: #999; text-align: center;">
      © ${new Date().getFullYear()} MyApp Inc. All rights reserved.
      </p>
      </div>
      </div>
      </div>
      `;
};
module.exports = { verifyEmailHTML, forgotPasswordHTML };
