const productRouter = require("express").Router();
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
} = userController;

productRouter.post("/register", register);
productRouter.post("/login", login);
productRouter.post("/refreshtoken", refreshAccessToken);
productRouter.post("/logout", logout);
productRouter.post("/forgot-password", forgotPassword);
productRouter.post("/forgot-password/reset-password", resetPassword);

productRouter.get("/current", verifyAccessToken, getCurrentUser);
productRouter.get("/", verifyAccessToken, isAdmin, getAllUsers);

productRouter.put("/current", verifyAccessToken, updateUser);
productRouter.put("/:uid", verifyAccessToken, isAdmin, updateUserByAdmin);

productRouter.delete("/:uid", verifyAccessToken, isAdmin, deleteUser);

module.exports = productRouter;
