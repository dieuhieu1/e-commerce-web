import { formatCurrencyVND } from "@/ultils/helpers";
import React from "react";

const TopSellProduct = ({ data: bestSold }) => {
  {
    /* Top Selling Products */
  }
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Top Selling Products
          </h2>
          <p className="text-sm text-gray-500 mt-1">Top 4 best sellers</p>
        </div>
      </div>
      <div className="space-y-4">
        {bestSold?.map((product, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <img
              src={product.thumb.image_url}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover group-hover:scale-110 transition-transform"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-800 mb-1">
                {product.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{product.sold} sold</span>
                <span className="text-green-600 font-medium">
                  {product.trend || "10%"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-gray-800">
                {formatCurrencyVND(product.price * product.sold)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellProduct;
