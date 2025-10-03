const router = require("express").Router();
const userController = require("../controllers/userController");
const { register } = userController;

router.post("/register", register);

module.exports = router;
