const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const { sendMail } = require("../ultils/sendMail");

// API Register
const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      success: false,
      message: "Missing inputs",
    });
  }
  // Check is user email existed
  const existedEmail = await User.findOne({ email: email });
  if (existedEmail) {
    throw new Error("This email has already existed!");
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      sucess: newUser ? true : false,
      message: newUser
        ? "Register is sucessfully. Please go to login page!"
        : "Something went wrong!",
    });
  }
});

// API Login
const login = asyncHandler(async (req, res) => {
  const { email, password: userPassword } = req.body;

  if (!email || !userPassword) {
    return res.status(400).json({
      success: false,
      message: "Missing inputs",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const isPasswordCorrect = await user.isCorrectPassword(userPassword);

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }
  // Convert to basic Object then destructuring
  const {
    password: hashedPassword,
    role,
    _id: userId,
    ...userData
  } = user.toObject();
  // Generate accessToken and refreshToken
  const accessToken = generateAccessToken(userId, role);
  const refreshToken = generateRefreshToken(userId, role);
  // Save refreshToken to the DB
  await User.findByIdAndUpdate(userId, { refreshToken }, { new: true });
  // Save refreshToken into Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: true,
    message: "Login successfully!",
    accessToken,
    userData: userData,
  });
});

// API Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId).select(
    "-refreshToken -role -password"
  );

  return res.status(200).json({
    sucess: true,
    result: user ? user : "User not found!",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // Get token from cookies
  const cookie = req.cookies;
  const refreshToken = cookie.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      sucess: false,
      message: "No fresh token in cookie",
    });
  }
  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid refresh token" });
  }
  // Verify refresh token
  await jwt.verify(
    refreshToken,
    process.env.JWT_SECRET,
    async (err, decoded) => {
      // If error return refresh token expired
      if (err) {
        return res
          .status(403)
          .json({ sucess: false, message: "Refresh token expired" });
      }
      // If not error, generate access token then return response success
      const newAccessToken = generateAccessToken(user._id, user.role);
      return res.status(200).json({
        success: true,
        newAccessToken: newAccessToken,
      });
    }
  );
});
// API logout
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  const refreshToken = cookie.refreshToken;

  if (!cookie || !refreshToken) {
    throw new Error("No refresh token in Cookies");
  }
  // Find user refresh token and delete refresh token when logout
  const user = await User.findOneAndUpdate(
    { refreshToken: refreshToken },
    { $set: { refreshToken: "" } },
    { new: true }
  );

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid refresh token" });
  }
  // Delete Cookie in Browser
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  return res
    .status(200)
    .json({ success: true, message: "Logout successfully!" });
});

// Forgot Password WorkFlow
// Step 1: Client sent Email
// Step 2: Server check email is valid ?
// Step 3: User check mail, click to link
// Type into input in Client and sent to server combine with the new password
// Step 4: Server get the new password and reset password token then check
// If valid, create new hash password replace in db
// Then return response change password successfully

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new Error("Missing email in request!");
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid user email!",
    });
  }
  const resetToken = user.createPasswordChangedToken();
  await user.save();
  // Create html template for mail
  const html = `
      <p>You requested a password reset. So:</p>
      <p>Click here to reset your password: <a href="${process.env.URL_SERVER}/api/user/forgot-password/reset-password/${resetToken}">${process.env.URL_SERVER}</a></p>
      <p>This link expires in 15 minutes.</p>
    `;

  const data = {
    email: email,
    html: html,
  };
  // Send mail to user email have the reset password link
  const result = await sendMail(data);
  // Return result
  return res.status(200).json({
    success: true,
    message: " Password reset email sent! Please go to email to check it",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, resetToken } = req.body;
  // Hash Reset Token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Find the user match the condition
  const user = await User.findOne({
    passwordResetToken: resetPasswordToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid reset token");
  }
  // HashedPassword will be gen before save
  user.password = password;
  // Re-assign neccessary field
  user.resetPasswordToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Updated new password!",
  });
});
module.exports = {
  register,
  login,
  getCurrentUser,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
};
