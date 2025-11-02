import React from "react";
import { useNavigate } from "react-router-dom";
import { PackageX, Home, Search } from "lucide-react";
import Button from "@/components/Common/Button";
import Breadcrumbs from "@/components/Breadcrumbs";

const ProductNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-main">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          {/* Icon with gradient background */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50"></div>
            <div className="relative bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-full border-4 border-red-200 shadow-xl">
              <PackageX className="w-24 h-24 text-red-500" strokeWidth={1.5} />
            </div>
          </div>

          {/* Main Message */}
          <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            Product Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2 text-center max-w-md">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <p className="text-md text-gray-500 mb-8 text-center max-w-md">
            It may have been removed, sold out, or is currently unavailable.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-6 py-3 bg-main text-white rounded-lg hover:bg-red-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Button>
            <Button
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 px-6 py-3 bg-white text-main border-2 border-main rounded-lg hover:bg-red-50 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Search className="w-5 h-5" />
              Browse All Products
            </Button>
          </div>

          {/* Divider */}
          <div className="w-full max-w-2xl mt-16 mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500 font-medium">
                  Or explore our categories
                </span>
              </div>
            </div>
          </div>

          {/* Category Suggestions */}
          <div className="w-full max-w-2xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              You might be interested in
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => navigate("/products?category=smartphone")}
                className="p-6 bg-white rounded-xl border border-gray-200 hover:border-main hover:shadow-xl transition-all cursor-pointer group transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 group-hover:text-main transition-colors mb-1">
                  Smartphones
                </h4>
                <p className="text-sm text-gray-500">
                  Explore the latest smartphones
                </p>
              </div>

              <div
                onClick={() => navigate("/products?category=laptop")}
                className="p-6 bg-white rounded-xl border border-gray-200 hover:border-main hover:shadow-xl transition-all cursor-pointer group transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 group-hover:text-main transition-colors mb-1">
                  Laptops
                </h4>
                <p className="text-sm text-gray-500">Browse powerful laptops</p>
              </div>

              <div
                onClick={() => navigate("/products?category=accessories")}
                className="p-6 bg-white rounded-xl border border-gray-200 hover:border-main hover:shadow-xl transition-all cursor-pointer group transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4 group-hover:bg-purple-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 group-hover:text-main transition-colors mb-1">
                  Accessories
                </h4>
                <p className="text-sm text-gray-500">Find useful accessories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductNotFound;
