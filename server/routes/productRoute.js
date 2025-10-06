const productRouter = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  createNewProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratingProduct,
} = require("../controllers/productController");

productRouter.post("/", verifyAccessToken, isAdmin, createNewProduct);
productRouter.get("/", getProducts);

productRouter.get("/:pid", getProduct);
productRouter.put("/:pid", updateProduct);
productRouter.delete("/:pid", verifyAccessToken, isAdmin, deleteProduct);
productRouter.put("/:id/rating", verifyAccessToken, ratingProduct);
module.exports = productRouter;
