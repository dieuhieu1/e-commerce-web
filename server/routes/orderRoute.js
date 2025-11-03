const orderRouter = require("express").Router();
const {
  createNewOrder,
  getOrders,
  getMyOrder,
  updateOrderStatus,
  cancelUserOrder,
  getDashboardStats,
  getDayRevenue,
  getOrdersStats,
} = require("../controllers/orderController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
// POST /api/orders/add
orderRouter.post("/add", verifyAccessToken, createNewOrder);
// GET /api/orders/
orderRouter.get("/", verifyAccessToken, isAdmin, getOrders);
// GET /api/orders/me
orderRouter.get("/me", verifyAccessToken, getMyOrder);
orderRouter.get("/day-revenue", verifyAccessToken, isAdmin, getDayRevenue);
orderRouter.get(
  "/dashboard-stats",
  verifyAccessToken,
  isAdmin,
  getDashboardStats
);
orderRouter.get("/stats", verifyAccessToken, isAdmin, getOrdersStats);
// PUT /api/:orderId
orderRouter.put("/cancel/:id", verifyAccessToken, cancelUserOrder);
// PUT /api/status/:orderId
orderRouter.put("/status/:id", verifyAccessToken, isAdmin, updateOrderStatus);

module.exports = orderRouter;
