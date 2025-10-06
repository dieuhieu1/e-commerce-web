const { errorHandler, notFound } = require("../middlewares/errorHandler");
const userRouter = require("./userRoute");
const productRouter = require("./productRoute");
const productCategoryRouter = require("./productCategoryRoute");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);

  app.use("/api/products/categories", productCategoryRouter);
  app.use("/api/products", productRouter);

  app.use("/api/blogs/categories", productCategoryRouter);
  // Middleware handle server error
  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoutes;
