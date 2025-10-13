const brandRoute = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

const {
  createNewBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

brandRoute.post("/", verifyAccessToken, isAdmin, createNewBrand);
brandRoute.get("/", getBrands);
brandRoute.get("/:id", getBrandById);
brandRoute.put("/:id", verifyAccessToken, isAdmin, updateBrand);
brandRoute.delete("/:id", verifyAccessToken, isAdmin, deleteBrand);

module.exports = brandRoute;
