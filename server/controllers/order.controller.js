const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

const asyncHandler = require("express-async-handler");
const { formatMoney } = require("../ultils/helpers");
const { orderConfirmationHTML, ORDER_STATUS } = require("../ultils/constants");
const { sendMail } = require("../ultils/sendMail");
const {
  sendNotificationToUser,
  sendNotificationToAdmin,
} = require("./socket/socket.controller");

const createNewOrder = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { products, total, address, paymentMethod } = req.body;

  if (!products?.length) throw new Error("Missing or invalid products array!");
  if (!total) throw new Error("Missing total amount!");
  if (!paymentMethod) throw new Error("Missing payment method!");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found!");

  if (address?.value) {
    const isExist = user.address.some(
      (item) =>
        item.value.trim().toLowerCase() === address.value.trim().toLowerCase()
    );
    if (!isExist) user.address.push(address);
  }

  let status = paymentMethod === "cod" ? "Pending" : "Processing";

  const orderData = {
    products,
    total,
    orderedBy: userId,
    paymentMethod,
    status,
    shippingAddress: address,
  };
  const newOrder = await Order.create(orderData);

  await Promise.all(
    products.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) throw new Error(`Product ${item.product} not found!`);
      if (product.quantity < item.quantity)
        throw new Error(`Not enough stock for ${product.title}`);
      product.quantity -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    })
  );

  user.cart = [];
  await user.save();

  // Emit notifications

  await sendNotificationToAdmin(req.io, {
    orderId: newOrder.orderId,
    message: `A new order have been placed from ${userId} need you check!`,
  });

  const populatedOrder = await newOrder.populate("products.product");
  // Send Email Notify
  const emailData = {
    customerName: `${user.firstname} ${user.lastname}`,
    orderId: newOrder.orderId,
    totalFormatted: formatMoney(newOrder.total) + " VND",
    paymentMethod: newOrder.paymentMethod,
    address: address,
    products: populatedOrder.products.map((item) => ({
      title: item.product.title,
      quantity: item.quantity,
      priceFormatted: item.price + " VND",
    })),
  };

  try {
    const htmlContent = orderConfirmationHTML(emailData);
    await sendMail({
      email: user.email,
      subject: `[Digital World] Confirm your order #${emailData.orderId}`,
      html: htmlContent,
    });
  } catch (err) {
    console.error("Failed to send email:", err.message);
  }

  return res.status(200).json({
    success: true,
    message: "Your order has been placed successfully!",
    order: newOrder,
  });
});

const cancelUserOrder = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params;
  const { _id: userId } = req.user;

  if (!orderId) {
    throw new Error("Order not found");
  }
  const order = await Order.findById({ _id: orderId });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.orderedBy.toString() !== userId.toString()) {
    throw new Error("You are not authorized or this order cannot be cancelled");
  }

  order.status = "Cancelled";

  const productsToRestock = order.products;
  const updateProductPromises = productsToRestock.map((item) => {
    return Product.findByIdAndUpdate(item.product, {
      $inc: { quantity: +item.quantity, sold: -item.quantity },
    });
  });

  await Promise.all(updateProductPromises);
  await order.save();

  res.status(200).json({
    success: true,
    message: "Your order has been cancelled successfully!",
    order,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id: oid } = req.params;
  const { status: newStatus } = req.body;
  console.log(req.body);

  if (!newStatus || !Object.values(ORDER_STATUS).includes(newStatus)) {
    throw new Error("Invalid or missing status");
  }

  const order = await Order.findById({ _id: oid });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (newStatus === "Cancelled" && order.status !== "Cancelled") {
    const productsToRestock = order.products;

    const updateProductPromises = productsToRestock.map((item) => {
      return Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: +item.quantity, sold: -item.quantity },
      });
    });

    await Promise.all(updateProductPromises);
  }

  order.status = newStatus;
  const updatedOrder = await order.save();
  console.log(updatedOrder.orderedBy.toString());

  // Emit Notification to FE
  await sendNotificationToUser(req.io, updatedOrder.orderedBy.toString(), {
    orderId: order.orderId,
    message: `Your order have been updated new status! ${statusEmoji[newStatus]} Your order ${order.orderId} is now ${newStatus}. Come to check it !`,
    status: newStatus,
  });

  res.status(200).json({
    success: true,
    message: "Order status updated successfully!",
    order: updatedOrder,
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "filter", "limit", "search"]; // Thêm "search"

  // Delete unnecessary field of query object (sort, page, limit, search)
  excludeFields.forEach((el) => {
    delete queryObj[el];
  });

  const allowedStatuses = [
    "Cancelled",
    "Succeed",
    "Pending",
    "Processing",
    "Shipping",
  ];

  if (queryObj.status && !allowedStatuses.includes(queryObj.status)) {
    delete queryObj.status; // bỏ qua nếu status không hợp lệ
  }

  // 1. Filtering
  let queryString = JSON.stringify(queryObj);
  // Replace "gte" to "$gte" for the query
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  const formattedQueries = JSON.parse(queryString);

  // ===== SEARCH BY ORDERID =====
  if (req.query.search) {
    const searchQuery = req.query.search.trim();

    // Search by orderId (case-insensitive, partial match)
    formattedQueries.$or = [
      { orderId: { $regex: searchQuery, $options: "i" } },
    ];
  }

  // Create query but not execute --> Adding more condition of sorting and pagination
  let query = Order.find(formattedQueries).populate(
    "orderedBy",
    "firstname lastname avatar email mobile address"
  );

  // 2. Sorting
  if (req.query.sort) {
    // '-price,quantity' --> [-price, quantity] --> -price quantity
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    // Default sortBy
    query = query.sort("-createdAt");
  }

  // 3. Field Limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  // 4. Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || process.env.LIMIT_PRODUCTS;
  // Skip page, so we need to skip element in 1 page (limit) * value of page
  const skip = (page - 1) * limit;
  query.skip(skip).limit(limit);

  // Execute the query

  // Đếm tổng số bản ghi với cùng điều kiện filter
  const totalCounts = await Order.countDocuments(formattedQueries);
  // Execute query
  const response = await query;

  return res.status(200).json({
    success: response ? true : false,
    totalCount: totalCounts,
    page: page,
    limit: limit,
    totalPages: Math.ceil(totalCounts / limit),
    order: response ? response : [],
  });
});

const getMyOrder = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "filter", "limit", "search"]; // Thêm "search"

  // Delete unnecessary field of query object (sort, page, limit, search)
  excludeFields.forEach((el) => {
    delete queryObj[el];
  });

  const allowedStatuses = [
    "Cancelled",
    "Succeed",
    "Pending",
    "Processing",
    "Shipping",
  ];

  if (queryObj.status && !allowedStatuses.includes(queryObj.status)) {
    delete queryObj.status; // bỏ qua nếu status không hợp lệ
  }

  // 1. Filtering
  let queryString = JSON.stringify(queryObj);
  // Replace "gte" to "$gte" for the query
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );

  const formattedQueries = JSON.parse(queryString);

  // ===== SEARCH BY ORDERID =====
  if (req.query.search) {
    const searchQuery = req.query.search.trim();

    // Search by orderId (case-insensitive, partial match)
    formattedQueries.$or = [
      { orderId: { $regex: searchQuery, $options: "i" } },
    ];
  }

  // Add userId filter
  const queries = { ...formattedQueries, orderedBy: userId };

  // Create query but not execute --> Adding more condition of sorting and pagination
  let query = Order.find(queries);

  // 2. Sorting
  if (req.query.sort) {
    // '-price,quantity' --> [-price, quantity] --> -price quantity
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    // Default sortBy
    query = query.sort("-createdAt");
  }

  // 3. Field Limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  // 4. Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || process.env.LIMIT_PRODUCTS;
  // Skip page, so we need to skip element in 1 page (limit) * value of page
  const skip = (page - 1) * limit;
  query.skip(skip).limit(limit);

  // Get all orders for statistics (with same filter conditions)
  const allOrders = await Order.find(queries);

  // Execute paginated query
  const response = await query;

  const totalCounts = allOrders.length;

  // Total Amount
  const totalAmount = allOrders.reduce((acc, o) => acc + o.total, 0);

  // Đếm đơn hàng thành công
  const completedOrders = allOrders.filter(
    (order) => order.status === "Succeed"
  ).length;

  return res.status(200).json({
    success: response ? true : false,
    totalCount: totalCounts,
    limit: limit,
    page: page,
    totalPages: Math.ceil(totalCounts / limit),
    orders: response ? response : [],
    completedOrders,
    totalAmount,
  });
});

const getOrdersStats = asyncHandler(async (req, res) => {
  const orders = await Order.find({}, "status");

  const stats = {
    totalOrders: orders.length,
    totalPending: orders.filter((o) => o.status === "Pending").length,
    totalSucceed: orders.filter((o) => o.status === "Succeed").length,
    totalCancelled: orders.filter((o) => o.status === "Cancelled").length,
    totalShipping: orders.filter((o) => o.status === "Shipping").length,
    totalProcessing: orders.filter((o) => o.status === "Processing").length,
  };

  res.status(200).json({
    success: true,
    orderStats: stats,
  });
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const orders = await Order.find({ status: { $ne: "Cancelled" } });
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const totalCustomers = await User.countDocuments();

  const totalSoldProducts = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalSold: { $sum: "$sold" },
      },
    },
  ]);

  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        status: { $ne: "Cancelled" },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$total" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return res.status(200).json({
    success: monthlyRevenue ? true : false,
    message: monthlyRevenue
      ? "Monthly Revenue"
      : "Failed to fetch dashboard stats",
    stats: {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalSoldProducts:
        totalSoldProducts.length > 0 ? totalSoldProducts[0].totalSold : 0,
      monthlyRevenue,
    },
  });
});

const getDayRevenue = asyncHandler(async (req, res) => {
  // Get month and year from req body;
  const { month, year, target } = req.body;

  // If don't have month, year in req body
  const now = new Date();
  // Get current month and current year;
  const targetMonth = month ? +month - 1 : now.getMonth();
  const targetYear = year ? +year : now.getFullYear();

  // Specify the start date and end date
  const startDate = new Date(targetYear, targetMonth - 1, 1);
  const endDate = new Date(targetYear, targetMonth, 1);

  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        status: { $in: ["Succeed", "Processing", "Pending"] },
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        totalRevenue: { $sum: "$total" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $addFields: {
        target: target ? parseFloat(target) : 1000,
      },
    },
  ]);
  return res.status(200).json({
    success: true,
    message: `Revenue days of ${targetMonth + 1}/${targetYear}`,
    data: dailyRevenue,
  });
});

module.exports = {
  createNewOrder,
  updateOrderStatus,
  getOrders,
  getMyOrder,
  cancelUserOrder,
  // Statstistic
  getDashboardStats,
  getDayRevenue,
  getOrdersStats,
};
