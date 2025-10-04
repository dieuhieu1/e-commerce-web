const router = require("express").Router();
const userController = require("../controllers/userController");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const {
  register,
  login,
  getCurrentUser,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
} = userController;

router.post("/register", register);
router.post("/login", login);
router.get("/current", verifyAccessToken, getCurrentUser);
router.post("/refreshtoken", refreshAccessToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password/reset-password", resetPassword);
module.exports = router;
