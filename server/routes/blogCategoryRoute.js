const blogCategoryRoute = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

const {
  createNewBlogCategory,
  getBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
} = require("../controllers/blogCategoryController");

blogCategoryRoute.post("/", verifyAccessToken, isAdmin, createNewBlogCategory);
blogCategoryRoute.get("/", getBlogCategories);
blogCategoryRoute.put("/:id", verifyAccessToken, isAdmin, updateBlogCategory);
blogCategoryRoute.delete(
  "/:id",
  verifyAccessToken,
  isAdmin,
  deleteBlogCategory
);
blogCategoryRoute.get("/:id", getBlogCategoryById);

module.exports = blogCategoryRoute;
