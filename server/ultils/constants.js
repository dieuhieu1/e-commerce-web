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

const users = [
  {
    _id: "6717a1001a2f3a9b1a1b0001",
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    mobile: "+841234567801",
    password: "$2b$10$abcdefghijklmno1",
    role: "admin",
    cart: [],
    address: ["123 Main St, Hanoi, Vietnam"],
    wishlist: [],
    isBlocked: false,
    refreshToken: null,
    passwordChangedAt: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    isVerified: true,
    emailVerificationToken: null,
    emailVerificationExpires: null,
    createdAt: "2025-10-22T07:00:00.000Z",
    updatedAt: "2025-10-22T07:00:00.000Z",
  },
  {
    _id: "6717a1001a2f3a9b1a1b0002",
    firstname: "Emma",
    lastname: "Tran",
    email: "emma.tran@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    mobile: "+841234567802",
    password: "$2b$10$abcdefghijklmno2",
    role: "user",
    cart: [],
    address: ["24 Nguyen Trai, Hanoi, Vietnam"],
    wishlist: [],
    isBlocked: false,
    refreshToken: null,
    passwordChangedAt: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    isVerified: true,
    emailVerificationToken: null,
    emailVerificationExpires: null,
    createdAt: "2025-10-22T07:05:00.000Z",
    updatedAt: "2025-10-22T07:05:00.000Z",
  },
  {
    _id: "6717a1001a2f3a9b1a1b0003",
    firstname: "Minh",
    lastname: "Nguyen",
    email: "minh.nguyen@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    mobile: "+841234567803",
    password: "$2b$10$abcdefghijklmno3",
    role: "user",
    cart: [],
    address: ["88 Le Loi, Da Nang, Vietnam"],
    wishlist: [],
    isBlocked: false,
    isVerified: true,
    createdAt: "2025-10-22T07:10:00.000Z",
    updatedAt: "2025-10-22T07:10:00.000Z",
  },
  {
    _id: "6717a1001a2f3a9b1a1b0004",
    firstname: "Linh",
    lastname: "Pham",
    email: "linh.pham@example.com",
    avatar: "https://i.pravatar.cc/150?img=4",
    mobile: "+841234567804",
    password: "$2b$10$abcdefghijklmno4",
    role: "user",
    address: ["56 Nguyen Hue, HCM City, Vietnam"],
    wishlist: [],
    isBlocked: false,
    isVerified: true,
    createdAt: "2025-10-22T07:15:00.000Z",
    updatedAt: "2025-10-22T07:15:00.000Z",
  },
  {
    _id: "6717a1001a2f3a9b1a1b0005",
    firstname: "David",
    lastname: "Le",
    email: "david.le@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    mobile: "+841234567805",
    password: "$2b$10$abcdefghijklmno5",
    role: "admin",
    address: ["12 Bach Dang, HCM City, Vietnam"],
    wishlist: [],
    isBlocked: false,
    isVerified: true,
    createdAt: "2025-10-22T07:20:00.000Z",
    updatedAt: "2025-10-22T07:20:00.000Z",
  },
  {
    _id: "6717a1001a2f3a9b1a1b0006",
    firstname: "Sophia",
    lastname: "Do",
    email: "sophia.do@example.com",
    avatar: "https://i.pravatar.cc/150?img=6",
    mobile: "+841234567806",
    password: "$2b$10$abcdefghijklmno6",
    role: "user",
    address: ["77 Ly Thuong Kiet, Hanoi, Vietnam"],
    wishlist: [],
    isBlocked: false,
    isVerified: true,
    createdAt: "2025-10-22T07:25:00.000Z",
    updatedAt: "2025-10-22T07:25:00.000Z",
  },
  {
    _id: "6717a1001a2f3a9b1a1b0007",
    firstname: "Quan",
    lastname: "Vu",
    email: "quan.vu@example.com",
    avatar: "https://i.pravatar.cc/150?img=7",
    mobile: "+841234567807",
    password: "$2b$10$abcdefghijklmno7",
    role: "user",
    address: ["100 Pham Van Dong, Hanoi, Vietnam"],
    wishlist: [],
    isBlocked: false,
    isVerified: true,
    createdAt: "2025-10-22T07:30:00.000Z",
    updatedAt: "2025-10-22T07:30:00.000Z",
  },
  {
    _id: "6717a1001a2f3a9b1a1b0008",
    firstname: "Mai",
    lastname: "Hoang",
    email: "mai.hoang@example.com",
    avatar: "https://i.pravatar.cc/150?img=8",
    mobile: "+841234567808",
    password: "$2b$10$abcdefghijklmno8",
    role: "user",
    address: ["31 Tran Hung Dao, Da Nang, Vietnam"],
    wishlist: [],
    isBlocked: false,
    isVerified: true,
    createdAt: "2025-10-22T07:35:00.000Z",
    updatedAt: "2025-10-22T07:35:00.000Z",
  },
  {
    _id: "6717a1001a2f3a9b1a1b0009",
    firstname: "Tuan",
    lastname: "Pham",
    email: "tuan.pham@example.com",
    avatar: "https://i.pravatar.cc/150?img=9",
    mobile: "+841234567809",
    password: "$2b$10$abcdefghijklmno9",
    role: "user",
    address: ["91 Tran Phu, Hoi An, Vietnam"],
    wishlist: [],
    isBlocked: false,
    isVerified: true,
    createdAt: "2025-10-22T07:40:00.000Z",
    updatedAt: "2025-10-22T07:40:00.000Z",
  },
  {
    _id: "6717a1001a2f3a9b1a1b0010",
    firstname: "Hanna",
    lastname: "Nguyen",
    email: "hanna.nguyen@example.com",
    avatar: "https://i.pravatar.cc/150?img=10",
    mobile: "+841234567810",
    password: "$2b$10$abcdefghijklmno10",
    role: "user",
    address: ["42 Vo Thi Sau, HCM City, Vietnam"],
    wishlist: [],
    isBlocked: false,
    isVerified: true,
    createdAt: "2025-10-22T07:45:00.000Z",
    updatedAt: "2025-10-22T07:45:00.000Z",
  },
];

module.exports = { verifyEmailHTML, forgotPasswordHTML, users };
