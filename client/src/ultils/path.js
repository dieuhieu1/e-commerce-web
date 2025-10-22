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
  MANAGE_USER: "manager-user",
  MANAGE_PRODUCTS: "manager-products",
  MANAGE_ORDER: "manager-order",
  CREATE_PRODUCT: "create-product",

  // Member
  MEMBER: "member",
  PERSONAL: "personal",
};

export default path;
