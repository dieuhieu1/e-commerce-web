import { createBrowserRouter } from "react-router-dom";
import Public from "./pages/public/Public";
import Home from "./pages/public/Home";
import Products from "./pages/public/Products";
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
    ],
  },
  {
    path: path.VERIFY_EMAIL,
    element: <VerifyEmail />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
