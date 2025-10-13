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
  updateUserAddress,
  updateUserCart,
} = userController;

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/refreshtoken", refreshAccessToken);
userRouter.post("/logout", logout);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/forgot-password/reset-password", resetPassword);

userRouter.get("/current", verifyAccessToken, getCurrentUser);
userRouter.get("/", verifyAccessToken, isAdmin, getAllUsers);

userRouter.put("/current", verifyAccessToken, updateUser);
userRouter.put("/address", verifyAccessToken, updateUserAddress);
userRouter.put("/cart", verifyAccessToken, updateUserCart);

userRouter.put("/:uid", verifyAccessToken, isAdmin, updateUserByAdmin);

userRouter.delete("/:uid", verifyAccessToken, isAdmin, deleteUser);

module.exports = userRouter;
