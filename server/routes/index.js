const { errorHandler, notFound } = require("../middlewares/errorHandler");
const userRouter = require("./userRoute");
const productRouter = require("./productRoute");
const productCategoryRouter = require("./productCategoryRoute");
const brandRouter = require("./brandRoute");
const imageRouter = require("./file-uploader/imageRoute");
const orderRouter = require("./orderRoute");
const insertDataRouter = require("./insertDataRoute");

const blogRouter = require("./blogRoute");
const initRoutes = (app) => {
  app.use("/api/user", userRouter);

  app.use("/api/products/categories", productCategoryRouter);
  app.use("/api/products", productRouter);

  app.use("/api/blogs/categories", productCategoryRouter);
  app.use("/api/blogs", blogRouter);

  app.use("/api/brands", brandRouter);

  app.use("/api/images", imageRouter);

  app.use("/api/order", orderRouter);

  app.use("/api/insert", insertDataRouter);
  // Middleware handle server error
  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoutes;
