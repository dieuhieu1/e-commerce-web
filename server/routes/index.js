const { errorHandler, notFound } = require("../middlewares/errorHandler");
const userRouter = require("./userRoute");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);

  //Middleware handle server error
  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoutes;
