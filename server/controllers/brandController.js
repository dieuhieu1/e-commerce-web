const asyncHandler = require("express-async-handler");
const Brand = require("../models/Brand");

const createNewBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    throw new Error("Missing Inputs!");
  }
  const brand = await Brand.create(req.body);

  return res.status(200).json({
    success: brand ? true : false,
    result: brand
      ? brand
      : "Something went wrong! Cannot create new brand. Please check the error log",
  });
});

const getBrands = asyncHandler(async (req, res) => {
  const brand = await Brand.find();

  return res.status(200).json({
    success: brand ? true : false,
    result: brand
      ? brand
      : "Something went wrong! Cannot get brand. Please check the error log",
  });
});

const getBrandById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("Missing inputs!");
  }

  const brand = await Brand.findById({ _id: id });

  return res.status(200).json({
    success: brand ? true : false,
    result: brand
      ? brand
      : "Something went wrong! Cannot find the brand. Please check the error log",
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new Error(
      "Missing params brand id! Please check your request param!"
    );
  }

  const updatedBrand = await Brand.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: updatedBrand ? true : false,
    result: updatedBrand
      ? updatedBrand
      : "Something went wrong! Cannot update the brand. Please check the error log",
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error(
      "Missing params brand id! Please check your request param!"
    );
  }

  const deletedBrand = await Brand.findByIdAndDelete({ _id: id }, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: deletedBrand ? true : false,
    result: deletedBrand
      ? deletedBrand
      : "Something went wrong! Cannot delete the brand. Please check the error log",
  });
});
module.exports = {
  createNewBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
