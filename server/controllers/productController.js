const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Product = require("../models/Product");
const makeSKU = require("uniqid");
const createNewProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw new Error("Missing Inputs!");
  }
  // Slugify
  if (req.body || req.body.title || req.body.images) {
    req.body.slug = slugify(req.body.title);
  }
  const newProduct = await Product.create(req.body);

  return res.status(200).json({
    success: newProduct ? true : false,
    message: newProduct
      ? "Created product successfully!"
      : "Cannot create new product!",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;

  if (!pid) throw new Error("Missing product id! Please check your request!");

  const product = await Product.findById(pid).populate({
    path: "ratings",
    populate: {
      path: "postedBy",
      select: "firstname lastname avatar",
    },
  });

  return res.status(200).json({
    success: product ? true : false,
    product: product ? product : `Cannot get the product with the id ${pid}`,
  });
});

const getProducts = asyncHandler(async (req, res) => {
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
  let colorQueryObject = {};

  if (queryObj?.title)
    formattedQueries.title = { $regex: queryObj.title, $options: "i" };
  if (queryObj?.category)
    formattedQueries.category = { $regex: queryObj.category, $options: "i" };
  if (queryObj?.color) {
    delete formattedQueries.color;
    const colorArr = queryObj.color?.split(",");
    const colorQuery = colorArr.map((el) => ({
      color: { $regex: el, $options: "iu" },
    }));
    colorQueryObject = { $or: colorQuery };
  }
  let queryObject = {};
  if (queryObj?.q) {
    delete formattedQueries.q;
    queryObject = {
      $or: [
        { color: { $regex: queryObj.q, $options: "i" } },
        { title: { $regex: queryObj.q, $options: "i" } },
        { category: { $regex: queryObj.q, $options: "i" } },
        { brand: { $regex: queryObj.q, $options: "i" } },
        { description: { $regex: queryObj.q, $options: "i" } },
      ],
    };
  }
  const queries = { ...colorQueryObject, ...formattedQueries, ...queryObject };
  // Create query but not execute --> Adding more condition of sorting and pagination
  let query = Product.find(queries);

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
  try {
    // Đếm tổng số bản ghi với cùng điều kiện filter
    const totalCounts = await Product.countDocuments(queries);
    // Execute query
    const response = await query;

    return res.status(200).json({
      success: response ? true : false,
      totalCount: totalCounts,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCounts / limit),
      products: response ? response : [],
    });
  } catch (err) {
    throw new Error(err);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;

  if (!pid) throw new Error("Missing product id! Please check your request!");
  console.log(req.body);

  if (req.body && req.body.title) {
    console.log("abc");

    const productTitle = req.body.title;
    req.body.slug = slugify(productTitle);
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: pid },
    req.body,
    { new: true }
  );

  return res.status(200).json({
    success: updatedProduct ? true : false,
    result: updatedProduct
      ? updatedProduct
      : `Something went wrong! Cannot update the product with id ${pid}`,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;

  if (!pid) throw new Error("Missing product id! Please check your request!");

  const deletedProduct = await Product.findByIdAndDelete({ _id: pid });

  return res.status(200).json({
    success: deletedProduct ? true : false,
    message: deletedProduct
      ? `Product with id: ${pid} deleted successfully`
      : `Something went wrong! Cannot delete the product with id ${pid}`,
  });
});

const ratingProduct = asyncHandler(async (req, res) => {
  const { star, comment, updatedAt } = req.body;
  const { pid } = req.params;
  // Get userId from middlware verify access token
  const { _id: userId } = req.user;
  console.log(req.params);

  if (!star || !pid || !comment) {
    throw new Error("Missing Inputs!");
  }

  const product = await Product.findById({ _id: pid });
  if (!product) {
    throw new Error("The product is not existed!");
  }
  // Check if user is rated
  const existingRating = product.ratings.find(
    (rating) => rating.postedBy.toString() === userId.toString()
  );

  if (existingRating) {
    // Update new star and new comment
    existingRating.star = star;
    existingRating.comment = comment;
    existingRating.updatedAt = updatedAt;
  } else {
    // Push new element to Array
    product.ratings.push({ star, comment, postedBy: userId, updatedAt });
  }

  // Average: Calcu sum with reduce then divided with total ratings
  console.log(product.ratings.length);
  if (product.ratings.length === 0) {
    product.ratings.length = 1;
  }
  const avg =
    product.ratings.reduce((acc, r) => acc + r.star * 1, 0) /
    product.ratings.length;
  // Round the result
  product.totalRatings = avg.toFixed(1);

  // Save the change
  const result = await product.save();

  return res.status(200).json({
    success: result ? true : false,
    message: "Rating the product successfully!",
    result: product,
  });
});

const addVariant = asyncHandler(async (req, res) => {
  const { pid } = req.params;

  const { title, price, color, thumb, images } = req.body;
  if (!title) {
    return res.status(400).json({ error: "You must enter title." });
  }
  if (!price) {
    return res.status(400).json({ error: "You must enter a price." });
  }
  if (!color) {
    return res.status(400).json({ error: "You must enter a color." });
  }
  const variant = {
    title,
    color,
    price: Number(price),
    thumb,
    images,
    sku: makeSKU().toUpperCase(),
  };
  console.log(variant);

  const updateVariant = await Product.findByIdAndUpdate(
    pid,
    {
      $push: {
        variants: variant,
      },
    },
    { new: true }
  );

  return res.status(200).json({
    success: updateVariant ? true : false,
    message: updateVariant
      ? "Add variant product successfully!"
      : "Cannot add variant product!",
  });
});

module.exports = {
  createNewProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratingProduct,
  addVariant,
};
