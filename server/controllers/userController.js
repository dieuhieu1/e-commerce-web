const User = require("../models/User");
const Product = require("../models/Product");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const { sendMail } = require("../ultils/sendMail");
const {
  verifyEmailHTML,
  forgotPasswordHTML,
  users,
} = require("../ultils/constants");

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

const changePassword = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "All password fields are required." });
  }

  // Find User in Databasez
  const user = await User.findById(userId).select("+password");
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // 3️⃣ So sánh mật khẩu hiện tại
  const isMatch = await user.isCorrectPassword(currentPassword);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Current password is incorrect." });
  }
  // HashedPassword will be gen before save
  user.password = newPassword;
  user.passwordChangedAt = Date.now();
  await user.save();

  // 6️⃣ Phản hồi thành công
  return res.status(200).json({
    success: true,
    message:
      "Password changed successfully! Please remember to login with your new password.",
  });
});

// CRUD User
const getAllUsers = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "filter", "limit"];

  // Delete uneccessary field of query object (sort, page, limit)
  excludeFields.forEach((el) => {
    delete queryObj[el];
  });

  // 1. Filtering
  let queryString = JSON.stringify(queryObj);
  // Replace "gte" to "$gte" for the query
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  const formattedQueries = JSON.parse(queryString);

  if (queryObj?.name)
    formattedQueries.name = { $regex: queryObj.name, $options: "i" };
  if (req.query.q) {
    delete formattedQueries.q;
    formattedQueries["$or"] = [
      { firstname: { $regex: req.query.q, $options: "i" } },
      { lastname: { $regex: req.query.q, $options: "i" } },
      { email: { $regex: req.query.q, $options: "i" } },
    ];
  }

  let query = User.find(formattedQueries);

  // 2. Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  // 3. Field Limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }
  // 4. Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || process.env.LIMIT_PRODUCTS;
  // Skip page, so we need to skip element in 1 page (limit) * value of page
  const skip = (page - 1) * limit;
  query.skip(skip).limit(limit);

  // Execute the query
  try {
    // Đếm tổng số bản ghi với cùng điều kiện filter
    const totalCounts = await User.countDocuments(formattedQueries);
    // Execute query
    const response = await query;

    return res.status(200).json({
      success: response ? true : false,
      totalCount: totalCounts,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCounts / limit),
      users: response ? response : [],
    });
  } catch (err) {
    throw new Error(err);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;

  if (!uid) throw new Error("missing input");

  const response = await User.findByIdAndDelete({ _id: uid });

  return res.status(200).json({
    success: response ? true : false,
    message: response
      ? `User with email: ${response.email} deleted successfully!`
      : "Something went wrong!",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;

  if (!uid || Object.keys(req.body).length === 0) {
    throw new Error("Missing input");
  }

  const response = await User.findByIdAndUpdate({ _id: uid }, req.body).select(
    "-role -password -refreshToken"
  );

  return res.status(200).json({
    success: response ? true : false,
    message: response
      ? `User with email: ${response.email} updated successfully!`
      : "Something went wrong!",
  });
});

// Update User Info
const updateUser = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  // 1. Tách 'address' ra khỏi 'req.body', 'otherFields' sẽ chứa phần còn lại
  const { address, ...otherFields } = req.body;

  if (!userId || Object.keys(req.body).length === 0) {
    throw new Error("Missing input");
  }

  const updateData = {};

  // 2. Khởi tạo $set với các trường 'otherFields'
  // Chỉ khởi tạo $set nếu 'otherFields' thực sự có dữ liệu
  if (Object.keys(otherFields).length > 0) {
    updateData.$set = otherFields;
  }

  // 3. Xử lý logic cho 'address'
  if (address) {
    if (Array.isArray(address)) {
      // Nếu 'address' là một mảng, GHI ĐÈ nó vào $set
      // Cần đảm bảo '$set' đã được khởi tạo
      if (!updateData.$set) updateData.$set = {};
      updateData.$set.address = address;
    } else {
      // Nếu 'address' là một object, PUSH nó
      updateData.$push = { address: address };
    }
  }

  const response = await User.findByIdAndUpdate({ _id: userId }, updateData, {
    new: true,
  }).select("-password -refreshToken");

  return res.status(200).json({
    success: !!response,
    message: response
      ? `User ${response.email} updated successfully!`
      : "Something went wrong!",
    updatedUser: response || null,
  });
});

// API Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id)
    .select("-refreshToken -password")
    .populate({
      path: "cart",
      populate: {
        path: "product",
        select: "title thumb price _id",
      },
    });

  return res.status(200).json({
    success: user ? true : false,
    result: user ? user : "User not found!",
  });
});

// Cart
const updateUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const { pid: product } = req.params;
  const { quantity = 1, color, price, thumb, title } = req.body;
  // Validate req.body

  if (!color) {
    throw new Error("Missing Color! Check your request params");
  }
  if (!price) {
    throw new Error("Missing Price! Check your request params");
  }
  if (!thumb) {
    throw new Error("Missing thumb! Check your request params");
  }
  if (!title) {
    throw new Error("Missing title! Check your request params");
  }

  // Find user in DB
  const user = await User.findById(_id);
  const userCart = user.cart;

  // Check is product in cart?
  const productAlreadyInCart = userCart.find((item) => {
    {
      return (
        item.product.toString() === product.toString() &&
        item.color === color &&
        item.title === title
      );
    }
  });

  // If yes plus the quantity
  if (productAlreadyInCart) {
    productAlreadyInCart.quantity += +quantity;
  } else {
    // Else push new product to cart array
    const newProduct = {
      product: product,
      quantity: quantity,
      color: color,
      price: price,
      thumb: thumb,
      title: title,
    };

    user.cart.push(newProduct);
  }
  // Saving the update
  const updatedUserCart = await user.save();
  return res.status(200).json({
    success: updatedUserCart ? true : false,
    message: updatedUserCart
      ? "Updated User Cart Successfully!"
      : "Something went wrong! Cannot updated user cart.",
    result: updatedUserCart ? updatedUserCart : [],
  });
});
const removeProductUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid: product } = req.params;
  const { color, title } = req.body;
  // Validate req.body
  if (!product) {
    throw new Error("Missing Product Id! Check your request params");
  }
  if (!color) {
    throw new Error("Missing Color! Check your request params");
  }
  if (!title) {
    throw new Error("Missing title! Check your request params");
  }

  const user = await User.findById(_id);
  const userCart = user.cart;
  console.log(userCart);

  const itemIndex = userCart?.findIndex((item) => {
    return (
      item.product.toString() === product.toString() &&
      item.color === color &&
      item.title === title
    );
  });
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Product not found in cart!",
    });
  }
  userCart.splice(itemIndex, 1);
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Removed product from cart successfully!",
    totalItems: userCart.length,
    cart: userCart,
  });
});

const updateUserWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid } = req.params;

  const user = User.findById(_id);
  const userWistList = user.wishlist;

  const alreadyWishlist = userWistList.find(
    (el) => el.toString() === pid.toString()
  );

  if (alreadyWishlist) {
    const updated = await user.updateOne(
      { $pull: { wishlist: pid } },
      { new: true }
    );
    return res.json({
      success: updated ? true : false,
      message: updated
        ? `Removed product from your wishlist`
        : "Something went wrong! Cannot remove product out of wishlist",
    });
  } else {
    const added = await user.updateOne(
      { $push: { wishlist: pid } },
      { new: true }
    );

    return res.json({
      success: added ? true : false,
      message: added
        ? `Added product to your wishlist`
        : "Something went wrong! Cannot add product to wishlist",
    });
  }
});

const createUsers = asyncHandler(async (req, res) => {
  const response = await User.create(users);
  return res.status(200).json({
    success: response ? true : false,
    users: response ? response : "Some thing went wrong",
  });
});

module.exports = {
  // Authorization
  register,
  login,
  getCurrentUser,
  refreshAccessToken,
  verifyEmail,
  logout,
  // Change password
  forgotPassword,
  resetPassword,
  changePassword,
  // Get User
  createUsers,
  getAllUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  // Cart
  updateUserCart,
  removeProductUserCart,
  // Wishlist
  updateUserWishlist,
};
