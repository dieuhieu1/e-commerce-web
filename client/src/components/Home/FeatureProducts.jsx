import React, { useEffect, useState } from "react";
import { apiGetProducts } from "@/apis/product";
import ProductCard from "../Product/ProductCard";

const FeatureProducts = () => {
  const [featureProducts, setFeatureProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const response = await apiGetProducts({
        limit: 20,
        totalRatings: 5,
      });
      if (response && response.products.length === 0) return;

      const { products } = response;

      const unique = products.filter(
        (item, index, self) =>
          index === self.findIndex((p) => p.title === item.title)
      );
      setFeatureProducts(unique);
    };

    loadProducts();
  }, []);

  return (
    <div className="w-full">
      <h3 className="uppercase font-semibold py-[15px] border-b-2 border-main text-[20px]">
        Featured Products
      </h3>

      <div className="flex flex-wrap mt-[15px] mx-[-10px]">
        {featureProducts.map((product) => (
          <ProductCard key={product._id} productData={product} />
        ))}
      </div>

      <div className="flex justify-between mt-6 gap-4 h-[700px]">
        {/* Ảnh trái */}
        <img
          className="flex-[2] h-full object-cover rounded-lg border"
          src="https://digital-world-2.myshopify.com/cdn/shop/files/Blue_And_Yellow_Modern_Electronic_Sale_Instagram_Post_580_x_655_px_1_600x.png?v=1750860746"
          alt=""
        />

        {/* Ảnh giữa */}
        <div className="flex flex-col flex-1 justify-between gap-4">
          <img
            className="h-[calc(50%-8px)] object-cover rounded-lg"
            src="https://digital-world-2.myshopify.com/cdn/shop/files/Orange_Colorful_Juicer_Photo_Instagram_Post_280_x_338_px_1_400x.png?v=1750860819"
            alt=""
          />
          <img
            className="h-[calc(50%-8px)] object-cover rounded-lg"
            src="https://digital-world-2.myshopify.com/cdn/shop/files/Red_and_Yellow_Classic_Neutrals_Cooking_Set_Product_Summer_Instagram_Post_280_x_338_px_1_cd2b3108-c6f2-4ee5-9597-8a501c61f0d6_400x.png?v=1750861662"
            alt=""
          />
        </div>

        {/* Ảnh phải */}
        <img
          className="flex-[1.5] h-full object-cover rounded-lg"
          src="https://digital-world-2.myshopify.com/cdn/shop/files/Blue_Yellow_Simple_Mega_Sale_Electronic_Instagram_Post_280_x_655_px_1_400x.png?v=1750862046"
          alt=""
        />
      </div>
    </div>
  );
};

export default FeatureProducts;
