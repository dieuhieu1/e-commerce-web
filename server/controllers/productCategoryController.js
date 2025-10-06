const asyncHandler = require("express-async-handler");
const ProductCategory = require("../models/ProductCategory");

const createNewProductCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    throw new Error("Missing Inputs!");
  }
  const productCategory = await ProductCategory.create(req.body);

  return res.status(200).json({
    success: productCategory ? true : false,
    result: productCategory
      ? productCategory
      : "Something went wrong! Cannot create new product category. Please check the error log",
  });
});

const getProductCategories = asyncHandler(async (z, res) => {
  const productCategories = await ProductCategory.find();

  return res.status(200).json({
    success: productCategories ? true : false,
    result: productCategories
      ? productCategories
      : "Something went wrong! Cannot get product category. Please check the error log",
  });
});

const getProductCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("Missing inputs!");
  }

  const productCategory = await ProductCategory.findById({ _id: id });

  return res.status(200).json({
    success: productCategory ? true : false,
    result: productCategory
      ? producCategory
      : "Something went wrong! Cannot find the product category. Please check the error log",
  });
});

const updateProductCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error(
      "Missing params product category id! Please check your request param!"
    );
  }

  const updatedProductCategory = await ProductCategory.findByIdAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );

  return res.status(200).json({
    success: updatedProductCategory ? true : false,
    result: updatedProductCategory
      ? updatedProductCategory
      : "Something went wrong! Cannot update the product category. Please check the error log",
  });
});

const deleteProductCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error(
      "Missing params product category id! Please check your request param!"
    );
  }

  const deletedProductCategory = await ProductCategory.findByIdAndDelete(
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
  createNewProductCategory,
  getProductCategories,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
};
