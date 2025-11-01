const userRouter = require("express").Router();
const userController = require("../controllers/userController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
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
} = userController;
userRouter.post("/insert", createUsers);

userRouter.post("/register", register);
userRouter.get("/verify-email/:token", verifyEmail);
userRouter.post("/login", login);
userRouter.post("/refreshtoken", refreshAccessToken);
userRouter.post("/logout", logout);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/change-password", verifyAccessToken, changePassword);
// CRUD user for Admin
userRouter.get("/current", verifyAccessToken, getCurrentUser);
userRouter.get("/", verifyAccessToken, isAdmin, getAllUsers);

userRouter.put("/wishlist", verifyAccessToken, updateUserWishlist);

// Update user Info
userRouter.put("/current", verifyAccessToken, updateUser);

userRouter.put("/:uid", verifyAccessToken, isAdmin, updateUserByAdmin);
userRouter.delete("/:uid", verifyAccessToken, isAdmin, deleteUser);

// Udpate Cart
userRouter.put("/cart/add/:pid", verifyAccessToken, updateUserCart);
userRouter.put("/cart/remove/:pid", verifyAccessToken, removeProductUserCart);

// Wishlist
module.exports = userRouter;
