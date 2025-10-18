import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-6">
      <h1 className="text-7xl font-bold text-red-500 mb-4">Oops!</h1>
      <p className="text-xl text-gray-700 mb-2">
        {error?.status === 404
          ? "The page you are looking for could not be found."
          : "Something went wrong while loading this page."}
      </p>

      <p className="text-gray-500 mb-6 italic">
        {error?.statusText || error?.message}
      </p>

      <Link
        to="/"
        className="flex items-center gap-2 bg-main text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all"
      >
        <FaHome /> Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
