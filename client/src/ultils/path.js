const path = {
  PUBLIC: "/",
  HOME: "",
  ALL: "*",
  LOGIN: "login",
  PRODUCTS: "products",
  CATEGORY: ":category",
  BLOGS: "blogs",
  OUTSERVICES: "services",
  FAQ: "faq",
  DETAIL_PRODUCT__CATEGORY__PID__TITLE: "/:category/:pid/:title",
  VERIFY_EMAIL: "verify-email",
  RESET_PASSWORD: "reset-password/:resetToken",

  // Admin
  ADMIN: "admin",
  DASHBOARD: "dashboard",
  MANAGE_USER: "manage-user",
  MANAGE_PRODUCTS: "manage-products",
  MANAGE_ORDER: "manage-order",
  CREATE_PRODUCT: "create-product",

  // Member
  MEMBER: "member",
  PERSONAL: "personal",
  HISTORY: "buy-history",
  WISHLIST: "wish-list",
  CHANGE_PASSWORD: "change-password",

  // Cart
  DETAIL_CART: "detail-cart",
  CHECK_OUT: "check-out",
};

export default path;
