const asyncHandler = require("express-async-handler");
const BlogCategory = require("../models/BlogCategory");

const createNewBlogCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    throw new Error("Missing Inputs!");
  }
  const blogCategory = await BlogCategory.create(req.body);

  return res.status(200).json({
    success: blogCategory ? true : false,
    result: blogCategory
      ? blogCategory
      : "Something went wrong! Cannot create new product category. Please check the error log",
  });
});

const getBlogCategories = asyncHandler(async (z, res) => {
  const blogCategories = await BlogCategory.find();

  return res.status(200).json({
    success: blogCategories ? true : false,
    result: blogCategories
      ? blogCategories
      : "Something went wrong! Cannot get product category. Please check the error log",
  });
});

const getBlogCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("Missing inputs!");
  }

  const blogCategory = await BlogCategory.findById({ _id: id });

  return res.status(200).json({
    success: blogCategory ? true : false,
    result: blogCategory
      ? producCategory
      : "Something went wrong! Cannot find the product category. Please check the error log",
  });
});

const updateBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error(
      "Missing params product category id! Please check your request param!"
    );
  }

  const updatedBlogCategory = await BlogCategory.findByIdAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );

  return res.status(200).json({
    success: updatedBlogCategory ? true : false,
    result: updatedBlogCategory
      ? updatedBlogCategory
      : "Something went wrong! Cannot update the product category. Please check the error log",
  });
});

const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error(
      "Missing params product category id! Please check your request param!"
    );
  }

  const deletedProductCategory = await BlogCategory.findByIdAndDelete(
    { _id: id },
    req.body,
    { new: true }
  );
  return res.status(200).json({
    success: deletedProductCategory ? true : false,
    result: deletedProductCategory
      ? deletedProductCategory
      : "Something went wrong! Cannot delete the product category. Please check the error log",
  });
});
module.exports = {
  createNewBlogCategory,
  getBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
};
