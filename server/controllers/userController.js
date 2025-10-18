const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const { sendMail } = require("../ultils/sendMail");
const { verifyEmailHTML, forgotPasswordHTML } = require("../ultils/constants");

// API Register
const register = asyncHandler(async (req, res) => {
  const { email, firstname, lastname, password, mobile } = req.body;
  if (!email) {
    return res.status(400).json({ error: "You must enter an email address." });
  }

  if (!firstname || !lastname) {
    return res.status(400).json({ error: "You must enter your full name." });
  }

  if (!password) {
    return res.status(400).json({ error: "You must enter a password." });
  }
  if (!mobile) {
    return res.status(400).json({ error: "You must enter a mobile." });
  }

  // Check is user email existed
  const existedEmail = await User.findOne({ email: email });

  if (existedEmail && existedEmail.isVerified) {
    throw new Error("This email has already in use!");
  }
  // If email existed but not verified, remove that user and create new one
  if (existedEmail && !existedEmail.isVerified) {
    await User.findByIdAndDelete({ _id: existedEmail._id });
  }
  // If not create new user
  const newUser = new User(req.body);
  const verificationToken = newUser.createEmailVerificationToken();
  await newUser.save();

  const data = {
    email: email,
    html: verifyEmailHTML(verificationToken),
    subject: "Digital World Email Verification",
  };
  const result = await sendMail(data);
  if (result) {
    return res.status(200).json({
      success: true,
      message: "Verification email sent. Please check your email box.",
    });
  } else {
    newUser.emailVerificationToken = undefined;
    newUser.emailVerificationExpires = undefined;
    await newUser.save();

    console.error(error);
    throw new Error("Email could not be sent. Please try registering again.");
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token: verificationToken } = req.params;
  console.log(req.params);
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.redirect(
      `${process.env.CLIENT_URL}/verify-email?verification=failed`
    );
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  return res.redirect(
    `${process.env.CLIENT_URL}/verify-email?verification=success`
  );
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
  if (!user.isVerified) {
    throw new Error("Account has not been verified. Please check your email.");
  }
  // Convert to basic Object then destructuring
  const {
    password: hashedPassword,
    role,
    _id: userId,
    refreshToken,
    ...userData
  } = user.toObject();
  // Generate accessToken and refreshToken
  const accessToken = generateAccessToken(userId, role);
  const newRefreshToken = generateRefreshToken(userId, role);
  // Save refreshToken to the DB
  await User.findByIdAndUpdate(userId, { refreshToken }, { new: true });
  // Save refreshToken into Cookie
  res.cookie("refreshToken", newRefreshToken, {
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
  const { _id } = req.user;

  const user = await User.findById(_id).select("-refreshToken -role -password");

  return res.status(200).json({
    success: user ? true : false,
    result: user ? user : "User not found!",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // Get token from cookies
  const cookie = req.cookies;
  const refreshToken = cookie.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
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
          .json({ success: false, message: "Refresh token expired" });
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

// Step 3: User check mail, click to link
// Type into input in Client and sent to server combine with the new password
// Step 4: Server get the new password and reset password token then check
// If valid, create new hash password replace in db
// Then return response change password successfully
// Forgot Password WorkFlow
const forgotPassword = asyncHandler(async (req, res) => {
  // Step 1: Client sent Email
  const { email } = req.body;

  if (!email) throw new Error("Missing email in request!");
  // Step 2: Server check email is valid ?
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res
      .status(400)
      .send({ error: "No user found for this email address." });
  }

  const resetToken = existingUser.createPasswordResetToken();
  await existingUser.save();
  // Create html template for mail

  const data = {
    email: email,
    html: forgotPasswordHTML(resetToken),
    subject: "Forgot password",
  };
  // Send mail to user email have the reset password link
  const result = await sendMail(data);
  // Return result
  return res.status(200).json({
    success: true,
    message: result.response?.includes("OK")
      ? " Password reset link have already sent! Please go to your email to check it"
      : "Something went wrong! Email not sent",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword, resetToken } = req.body;
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
  user.password = newPassword;
  // Re-assign neccessary field
  user.passwordResetToken = "";
  user.passwordResetExpires = "";
  user.passwordChangedAt = Date.now();

  await user.save();

  return res.status(200).json({
    success: true,
    message:
      "Password changed successfully! Please login with your new password.",
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    users: response,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  if (!_id) throw new Error("missing input");

  const response = await User.findByIdAndDelete({ _id });

  return res.status(200).json({
    success: response ? true : false,
    message: response
      ? `User with email: ${response.email} deleted successfully!`
      : "Something went wrong!",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  if (!_id || Object.keys(req.body).length === 0) {
    throw new Error("Missing input");
  }

  const response = await User.findByIdAndUpdate({ _id }, req.body).select(
    "-role -password -refreshToken"
  );

  return res.status(200).json({
    success: response ? true : false,
    message: response
      ? `User with email: ${response.email} updated successfully!`
      : "Something went wrong!",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  if (!_id || Object.keys(req.body).length === 0) {
    throw new Error("Missing input");
  }

  const response = await User.findByIdAndUpdate({ _id }, req.body).select(
    "-role -password -refreshToken"
  );

  return res.status(200).json({
    success: response ? true : false,
    message: response
      ? `User with email: ${response.email} updated successfully!`
      : "Something went wrong!",
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  if (!req.body.address) {
    throw new Error("Missing inputs! Please check your request");
  }

  const response = await User.findByIdAndUpdate(
    { _id: userId },
    { $push: { address: req.body.address } },
    { new: true }
  ).select("-password -role -refreshToken");

  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response
      ? response
      : "Something went wrong! Cannot updated user info",
  });
});

const updateUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId, quantity, color } = req.body;
  console.log(req.body);

  if (!productId || !quantity || !color) {
    throw new Error("Missing Input! Check your request params");
  }

  const user = await User.findById(_id);
  const userCart = user.cart;
  console.log(userCart);

  const productAlreadyInCart = userCart.find(
    (item) =>
      item.productId.toString() === productId.toString() && item.color === color
  );

  if (productAlreadyInCart) {
    productAlreadyInCart.quantity += +quantity;
  } else {
    const newProduct = {
      productId: productId,
      quantity: quantity,
      color: color,
    };
    user.cart.push(newProduct);
  }

  const updatedUser = await user.save();
  return res.status(200).json({
    success: updatedUser ? true : false,
    message: "Updated User Cart Successfully!",
    result: updatedUser
      ? updatedUser
      : "Something went wrong! Cannot updated user cart.",
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
  getAllUsers,
  deleteUser,
  updateUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  updateUserCart,
  verifyEmail,
};
