const productRouter = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  createNewProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratingProduct,
  addVariant,
} = require("../controllers/productController");

const { uploadCloud: uploader } = require("../config/cloudinary.config");
// POST /api/products
productRouter.post("/", verifyAccessToken, isAdmin, createNewProduct);

// GET /api/products
productRouter.get("/", getProducts);

// GET /api/products/:id
productRouter.get("/:pid", getProduct);

// PUT /api/products/variants/:id
productRouter.put("/variant/:pid", addVariant);

// PUT /api/products/:id
productRouter.put("/:pid", updateProduct);

// PUT /api/products/rating/:id
productRouter.put("/ratings/:pid", verifyAccessToken, ratingProduct);

// DELETE /api/products/:id
productRouter.delete("/:pid", verifyAccessToken, isAdmin, deleteProduct);

module.exports = productRouter;
