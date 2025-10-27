const userRouter = require("express").Router();
const userController = require("../controllers/userController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
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
  updateUserByAdmin,
  updateUserCart,
  verifyEmail,
  createUsers,
  changePassword,
  removeProductUserCart,
} = userController;

userRouter.post("/register", register);
userRouter.post("/insert", createUsers);

userRouter.get("/verify-email/:token", verifyEmail);
userRouter.post("/login", login);
userRouter.post("/refreshtoken", refreshAccessToken);
userRouter.post("/logout", logout);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/change-password", verifyAccessToken, changePassword);

userRouter.get("/current", verifyAccessToken, getCurrentUser);
userRouter.get("/", verifyAccessToken, isAdmin, getAllUsers);

userRouter.put("/current", verifyAccessToken, updateUser);
userRouter.put("/cart", verifyAccessToken, updateUserCart);
userRouter.put("/cart/remove/:pid", verifyAccessToken, removeProductUserCart);

userRouter.put("/:uid", verifyAccessToken, isAdmin, updateUserByAdmin);

userRouter.delete("/:uid", verifyAccessToken, isAdmin, deleteUser);

module.exports = userRouter;
