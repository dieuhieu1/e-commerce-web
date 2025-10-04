const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Prevent if no token in request
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      message: "No token provided!",
    });
  }

  const token = authHeader.split(" ")[1];

  // Verfiy access token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token" });
    }
    // Assign user data for the request
    req.user = decoded;
    next();
  });
});

module.exports = { verifyAccessToken };
