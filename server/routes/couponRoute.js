const express = require("express");
const router = express.Router();
const {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

// POST /api/coupons
router.post("/", createCoupon);

// GET /api/coupons
router.get("/", getCoupons);

// GET /api/coupons/:id
router.get("/:id", getCoupon);

// PUT /api/coupons/:id
router.put("/:id", updateCoupon);

// DELETE /api/coupons/:id
router.delete("/:id", deleteCoupon);

module.exports = router;
