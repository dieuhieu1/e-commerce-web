import { createBrowserRouter } from "react-router-dom";
import Public from "./pages/public/Public";
import Home from "./pages/public/Home";
import Services from "./pages/public/Services";
import FAQ from "./pages/public/FAQ";
import DetailProduct from "./pages/public/DetailProduct";
import Blogs from "./pages/public/Blogs";
import VerifyEmail from "./pages/public/VerifyEmail";
import ResetPassword from "./pages/public/ResetPassword";
import LoginPage from "./pages/public/LoginPage";
import path from "./ultils/path";
import ErrorPage from "./pages/public/ErrorPage";
import CategoryPage from "./pages/public/CategoryPage";
import Products from "./pages/public/Products";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageUser from "./pages/admin/ManageUser";
import ManageProduct from "./pages/admin/ManageProduct";
import CreateProduct from "./pages/admin/CreateProduct";
import MemberLayout from "./pages/member/MemberLayout";
import Personal from "./pages/member/Personal";
import ManageOrder from "./pages/admin/ManageOrder";
import WishList from "./pages/member/WishList";
import History from "./pages/member/History";
import ChangePassword from "./pages/member/ChangePassword";
import DetailCart from "./pages/member/DetailCart";
import Checkout from "./pages/member/Checkout";
import { Root } from "@radix-ui/react-dialog";

export const router = createBrowserRouter([
  {
    path: path.LOGIN,
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: path.PUBLIC,
    element: <Public />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: path.HOME,
        element: <Home />,
      },
      {
        path: path.CATEGORY,
        element: <CategoryPage />,
      },
      {
        path: path.BLOGS,
        element: <Blogs />,
      },
      {
        path: path.DETAIL_PRODUCT__CATEGORY__PID__TITLE,
        element: <DetailProduct />,
      },
      {
        path: path.FAQ,
        element: <FAQ />,
      },
      {
        path: path.OUTSERVICES,
        element: <Services />,
      },
      {
        path: path.PRODUCTS,
        element: <Products />,
      },
      {
        path: path.RESET_PASSWORD,
        element: <ResetPassword />,
      },
      {
        path: path.DETAIL_CART,
        element: <DetailCart />,
      },
    ],
  },
  {
    path: path.ADMIN,
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: path.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: path.MANAGE_USER,
        element: <ManageUser />,
      },
      {
        path: path.MANAGE_PRODUCTS,
        element: <ManageProduct />,
      },
      {
        path: path.MANAGE_ORDER,
        element: <ManageOrder />,
      },
      {
        path: path.CREATE_PRODUCT,
        element: <CreateProduct />,
      },
    ],
  },
  {
    path: path.MEMBER,
    element: <MemberLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: path.PERSONAL, element: <Personal /> },
      { path: path.WISHLIST, element: <WishList /> },
      { path: path.HISTORY, element: <History /> },
      { path: path.CHANGE_PASSWORD, element: <ChangePassword /> },
    ],
  },
  {
    path: path.VERIFY_EMAIL,
    element: <VerifyEmail />,
    errorElement: <ErrorPage />,
  },
  {
    path: path.CHECK_OUT,
    element: <Checkout />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/",
    element: <Root />,
  },
]);
