const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const User = require("../models/User");

const asyncHandler = require("express-async-handler");

const createNewOrder = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { couponId } = req.body;
  const user = await User.findById({ _id: userId })
    .select("cart")
    .populate("cart.productId", "title slug price");
  // Get user cart --> Populate to the Product Details
  const userCart = user.cart;
  const products = userCart?.map((item) => ({
    product: item.productId,
    count: item.quantity,
    color: item.color,
  }));
  // Calculate total base on quantity and price

  let total = userCart.reduce(
    (sum, el) => el.quantity * el.productId.price + sum,
    0
  );

  const orderData = {
    products: products,
    total: total,
    orderedBy: userId,
  };
  if (couponId) {
    const selectedCoupon = await Coupon.findById({ _id: couponId });
    total =
      Math.round((total * (1 - +selectedCoupon.discount / 100)) / 1000) *
        1000 || total;
    console.log(total);

    orderData.total = total;
    orderData.coupon = couponId;
  }

  const newOrder = await Order.create(orderData);

  return res.status(200).json({
    success: newOrder ? true : false,
    message: "Your order has been placed successfully!",
    order: newOrder
      ? newOrder
      : "Your request could not be processed. Please try again",
  });
  // Create products Array contains info about product: product, orderBy, count
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  //   const { _id: userId } = req.user;
  const { id: orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new Error("Missing input status! Please check your request body");
  }

  const updatedStatus = await Order.findByIdAndUpdate(
    { _id: orderId },
    { status },
    { new: true }
  );

  return res.json({
    success: updatedStatus ? true : false,
    message: updatedStatus
      ? "Item status has been updated successfully!"
      : "Your request could not be processed. Please try again.",
    result: updatedStatus,
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const ordersDoc = await Order.find()
    .sort("-createdAt")
    .populate("products.product")
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();
  const count = await Order.countDocuments();

  const orders = ordersDoc.map((order) => ({
    _id: order._id,
    total: order.total,
    orderedBy: order.orderedBy,
    products: order?.products,
    coupon: order?.coupon,
    status: order.status,
  }));

  return res.status(200).json({
    success: orders ? true : false,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
    count,
    orders: orders,
  });
});

const getMyOrder = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { page = 1, limit = 10 } = req.query;

  const ordersDoc = await Order.find({ orderedBy: userId })
    .sort("-createdAt")
    .populate("products")
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();

  const count = await Order.countDocuments();

  const orders = ordersDoc.map((order) => ({
    _id: order._id,
    total: order.total,
    orderedBy: order.orderedBy,
    products: order?.products,
    coupon: order?.coupon,
    status: order.status,
  }));

  return res.status(200).json({
    success: orders ? true : false,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
    count,
    orders: orders,
  });
});

module.exports = { createNewOrder, updateOrderStatus, getOrders, getMyOrder };
