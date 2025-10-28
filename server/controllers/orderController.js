const Order = require("../models/Order");
const User = require("../models/User");

const asyncHandler = require("express-async-handler");

const createNewOrder = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { products, total, address, status } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!products || !Array.isArray(products) || products.length === 0) {
    throw new Error("Missing or invalid products array!");
  }
  if (!total) {
    throw new Error("Missing total amount!");
  }

  const user = await User.findById(userId);
  // Nếu có address gửi lên
  if (address && address.value) {
    if (!user) throw new Error("User not found!");

    // Kiểm tra xem địa chỉ đã tồn tại trong user.address chưa
    const isExist = user.address.some(
      (item) =>
        item.value.trim().toLowerCase() === address.value.trim().toLowerCase()
    );

    // Nếu chưa có thì push vào
    if (!isExist) {
      user.address.push(address);
      await user.save();
    }
  }

  // Tạo dữ liệu đơn hàng
  const orderData = {
    products,
    total,
    orderedBy: userId,
    status: status || "Processing",
  };

  const newOrder = await Order.create(orderData);

  // Xóa giỏ hàng sau khi đặt hàng
  user.cart = [];
  await user.save();
  return res.status(200).json({
    success: !!newOrder,
    message: newOrder
      ? "Your order has been placed successfully!"
      : "Your request could not be processed. Please try again.",
    order: newOrder,
  });
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
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "filter", "limit"];

  // Delete uneccessary field of query object (sort, page, limit)
  excludeFields.forEach((el) => {
    delete queryObj[el];
  });

  // 1. Filtering
  let queryString = JSON.stringify(queryObj);
  // Replace "gte" to "$gte" for the query
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  const formattedQueries = JSON.parse(queryString);
  // let colorQueryObject = {};

  // if (queryObj?.title)
  //   formattedQueries.title = { $regex: queryObj.title, $options: "i" };
  // if (queryObj?.category)
  //   formattedQueries.category = { $regex: queryObj.category, $options: "i" };
  // if (queryObj?.color) {
  //   delete formattedQueries.color;
  //   const colorArr = queryObj.color?.split(",");
  //   const colorQuery = colorArr.map((el) => ({
  //     color: { $regex: el, $options: "iu" },
  //   }));
  //   colorQueryObject = { $or: colorQuery };
  // }
  // let queryObject = {};
  // if (queryObj?.q) {
  //   delete formattedQueries.q;
  //   queryObject = {
  //     $or: [
  //       { color: { $regex: queryObj.q, $options: "i" } },
  //       { title: { $regex: queryObj.q, $options: "i" } },
  //       { category: { $regex: queryObj.q, $options: "i" } },
  //       { brand: { $regex: queryObj.q, $options: "i" } },
  //       { description: { $regex: queryObj.q, $options: "i" } },
  //     ],
  //   };
  // }
  const queries = { formattedQueries };
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

  // Execute the query

  // Đếm tổng số bản ghi với cùng điều kiện filter
  const totalCounts = await Order.countDocuments(queries);
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
  const excludeFields = ["page", "sort", "filter", "limit"];

  // Delete uneccessary field of query object (sort, page, limit)
  excludeFields.forEach((el) => {
    delete queryObj[el];
  });

  // 1. Filtering
  let queryString = JSON.stringify(queryObj);
  // Replace "gte" to "$gte" for the query
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  const formattedQueries = JSON.parse(queryString);
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

  // Execute the query

  // Đếm tổng số bản ghi với cùng điều kiện filter
  const totalCounts = await Order.countDocuments(queries);
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
// const getMyOrder = asyncHandler(async (req, res) => {
//   const { _id: userId } = req.user;
//   const { page = 1, limit = 10 } = req.query;

//   const ordersDoc = await Order.find({ orderedBy: userId })
//     .sort("-createdAt")
//     .populate("products")
//     .limit(limit)
//     .skip((page - 1) * limit)
//     .exec();

//   const count = await Order.countDocuments();

//   const orders = ordersDoc.map((order) => ({
//     _id: order._id,
//     total: order.total,
//     orderedBy: order.orderedBy,
//     products: order?.products,
//     coupon: order?.coupon,
//     status: order.status,
//   }));

//   return res.status(200).json({
//     success: orders ? true : false,
//     totalPages: Math.ceil(count / limit),
//     currentPage: Number(page),
//     count,
//     orders: orders,
//   });
// });

module.exports = { createNewOrder, updateOrderStatus, getOrders, getMyOrder };
