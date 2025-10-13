const Coupon = require("../models/Coupon");
const asyncHandler = require("express-async-handler");

// Create coupon
const createCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry)
    return res.status(400).json({ success: false, message: "Missing inputs" });
  if (req.body.expiry) {
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  }
  const newCoupon = await Coupon.create({ name, discount, expiry });
  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    coupon: newCoupon,
  });
});

// Get all coupons
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: coupons.length,
    coupons,
  });
});

// Get a single coupon by ID
const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon)
    return res
      .status(404)
      .json({ success: false, message: "Coupon not found" });
  res.status(200).json({ success: true, coupon });
});

// Update coupon
const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (Object.keys(req.body).length === 0) {
    throw new Error("Missing Inputs!");
  }

  if (req.body.expiry) {
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  }
  const updated = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated)
    return res
      .status(404)
      .json({ success: false, message: "Coupon not found" });
  res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    coupon: updated,
  });
});

// Delete coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Coupon.findByIdAndDelete(id);
  if (!deleted) {
    return res
      .status(404)
      .json({ success: false, message: "Coupon not found" });
  }
  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});

module.exports = {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
};
