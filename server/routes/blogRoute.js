const blogRoute = require("express").Router();
const {
  createNewBlog,
  getBlogs,
  getBlog,
  updateBlogs,
  likeBlog,
  dislikeBlog,
} = require("../controllers/blogController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

blogRoute.post("/", verifyAccessToken, isAdmin, createNewBlog);
blogRoute.get("/", getBlogs);
blogRoute.get("/:id", getBlog);
blogRoute.put("/:id", verifyAccessToken, isAdmin, updateBlogs);
blogRoute.put("/like/:id", verifyAccessToken, likeBlog);
blogRoute.put("/dislike/:id", verifyAccessToken, dislikeBlog);

module.exports = blogRoute;
