const productCategoryRoute = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

const {
  createNewProductCategory,
  getProductCategoryById,
  getProductCategories,
  updateProductCategory,
  deleteProductCategory,
} = require("../controllers/productCategoryController");

productCategoryRoute.post(
  "/",
  verifyAccessToken,
  isAdmin,
  createNewProductCategory
);
productCategoryRoute.get("/", getProductCategories);
productCategoryRoute.put(
  "/:id",
  verifyAccessToken,
  isAdmin,
  updateProductCategory
);
productCategoryRoute.delete(
  "/:id",
  verifyAccessToken,
  isAdmin,
  deleteProductCategory
);
productCategoryRoute.get("/:id", getProductCategoryById);

module.exports = productCategoryRoute;
