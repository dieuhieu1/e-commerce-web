const Blog = require("../models/Blog");
const asyncHandler = require("express-async-handler");

const createNewBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    throw new Error("Missing Inputs");
  }

  const newBlog = await Blog.create({ title, description, category });

  return res.status(200).json({
    success: newBlog ? true : false,
    result: newBlog
      ? newBlog
      : "Something went wrong! Cannot create new blog. Please check error log!",
  });
});

const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find();

  return res.status(200).json({
    success: blogs ? true : false,
    result: blogs
      ? blogs
      : "Something went wrong! Cannot get blogs. Please check error log!",
  });
});
const updateBlogs = asyncHandler(async (req, res) => {
  const { id: blogId } = req.params;
  const { title, description, category } = req.body;
  if (!blogId) {
    throw new Error(
      "Missing params blog id. Please recheck your params request!"
    );
  }
  if (!title || !description || !category) {
    throw new Error("Missing inputs!");
  }
  const updatedBlogs = await Blog.findByIdAndUpdate(
    { _id: blogId },
    { title, description, category },
    { new: true }
  );

  return res.status(200).json({
    success: updatedBlogs ? true : false,
    result: updatedBlogs
      ? updatedBlogs
      : "Something went wrong! Cannot updated blogs. Please check error log!",
  });
});

const likeBlog = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { id: blogId } = req.params;

  if (!blogId) {
    throw new Error(
      "Missing params blog id. Please recheck your params request!"
    );
  }

  const blog = await Blog.findById({ _id: blogId });

  const alreadyDisliked = blog.dislikes.find((el) => el.toString() === userId);

  // Check if Blog is disliked by current user? --> Undo dislike
  if (alreadyDisliked) {
    await Blog.findByIdAndUpdate(
      { _id: blogId },
      { $pull: { dislikes: userId } },
      { new: true }
    );
  }
  // Check if Blog is liked by current user?

  const alreadyLike = blog.likes.find((el) => el.toString() === userId);

  // If yes, pull the like out of Array likes --> Unlike
  if (alreadyLike) {
    const updated = await Blog.findByIdAndUpdate(
      { _id: blogId },
      { $pull: { likes: userId } },
      { new: true }
    );
    return res.json({
      success: updated ? true : false,
      message: "Unliked the blog ",
      updated,
    });
  } else {
    // If no, push the like to Array likes --> Like
    const updated = await Blog.findByIdAndUpdate(
      { _id: blogId },
      { $push: { likes: userId } },
      { new: true }
    );
    return res.json({
      success: true,
      message: "Liked the blog ",
      updated,
    });
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { id: blogId } = req.params;
  const { _id: userId } = req.user;

  if (!blogId) {
    throw new Error("Missing param blog id! Please check your request params");
  }

  const blog = await Blog.findById({ _id: blogId });
  // Check if have user already liked the blog
  const alreadyLiked = blog.likes.find((el) => el.toString() === userId);
  // If yes
  if (alreadyLiked) {
    // Remove the like
    await Blog.findByIdAndUpdate(
      { _id: blogId },
      { $pull: { likes: userId } },
      { new: true }
    );
  }

  // Check if have user already liked the blog
  const alreadyDisliked = blog.dislikes.find((el) => el.toString() === userId);

  if (alreadyDisliked) {
    const undisliked = await Blog.findByIdAndUpdate(
      { _id: blogId },
      { $pull: { dislike: userId } },
      { new: true }
    );
    return res.json({
      success: true,
      message: "User undisliked the blog!",
      result: undisliked,
    });
  } else {
    const disliked = await Blog.findByIdAndUpdate(
      { _id: blogId },
      { $push: { dislike: userId } },
      { new: true }
    );
    return res.json({
      success: true,
      message: "User disliked the blog!",
      result: disliked,
    });
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { id: blogId } = req.params;
  // Increase totalViews when the api call
  const blog = await Blog.findByIdAndUpdate(
    { _id: blogId },
    { $inc: { numberViews: 1 } }
  )
    .populate({
      path: "likes",
      select: "firstname lastname",
    })
    .populate({ path: "dislikes", select: "firstname lastname" });

  return res.json({
    success: blog ? true : false,
    result: blog,
  });
});
module.exports = {
  createNewBlog,
  getBlogs,
  updateBlogs,
  likeBlog,
  dislikeBlog,
  getBlog,
};
