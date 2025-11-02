import { apiGetProducts } from "@/apis/product";
import React, { useEffect, useState } from "react";
import CustomSlider from "../Common/CustomSlider";

const HighRating = () => {
  const [highRatingProducts, setHighRatingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHighRating = async () => {
    try {
      setLoading(true);
      const response = await apiGetProducts({ sort: "-totalRatings" });
      if (response.success && response.products) {
        setHighRatingProducts(response.products.slice(0, 10));
      }
    } catch (error) {
      console.error("Failed to fetch high rating products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighRating();
  }, []);
  return (
    <>
      <h3 className="uppercase font-semibold py-[15px] border-b-2 border-main text-[20px]">
        High Rating
      </h3>
      <div className="mt-4">
        {loading ? (
          <div className="text-center text-gray-500 py-10">
            Loading high-rating products...
          </div>
        ) : highRatingProducts.length > 0 ? (
          <CustomSlider products={highRatingProducts} />
        ) : (
          <div className="text-center text-gray-500 py-10">
            No high-rating products found.
          </div>
        )}
      </div>
    </>
  );
};

export default HighRating;
