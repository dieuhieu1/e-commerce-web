import React, { useEffect, useState } from "react";
import { apiGetProducts } from "@/apis/product";
import ProductCard from "../Product/ProductCard";

const FeatureProducts = () => {
  const [featureProducts, setFeatureProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const response = await apiGetProducts({
        limit: 21,
        sort: "totalRatings",
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
    <div className="w-full ">
      <h3 className="uppercase font-semibold py-[15px] border-b-2 border-main text-[20px]">
        Featured Products
      </h3>

      <div className="flex flex-wrap my-[15px] mx-[-10px] ">
        {featureProducts.map((product) => (
          <ProductCard key={product._id} productData={product} />
        ))}
      </div>
      {/* Divider */}
      <div className="border-t-2 border-main my-8"></div>

      <div className="grid grid-cols-4 grid-rows-2 gap-4 mt-6">
        {/* Ảnh trái */}
        <img
          className="w-full h-full object-cover rounded-lg border col-span-2 row-span-2"
          src="https://digital-world-2.myshopify.com/cdn/shop/files/Blue_And_Yellow_Modern_Electronic_Sale_Instagram_Post_580_x_655_px_1_600x.png?v=1750860746"
          alt=""
        />

        {/* Ảnh giữa */}
        <img
          className="w-full h-full object-cover rounded-lg border col-span-1 row-span-1"
          src="https://digital-world-2.myshopify.com/cdn/shop/files/Orange_Colorful_Juicer_Photo_Instagram_Post_280_x_338_px_1_400x.png?v=1750860819"
          alt=""
        />
        <img
          className=" w-full h-full object-cover rounded-lg border col-span-1 row-span-2"
          src="https://digital-world-2.myshopify.com/cdn/shop/files/Blue_Yellow_Simple_Mega_Sale_Electronic_Instagram_Post_280_x_655_px_1_400x.png?v=1750862046"
          alt=""
        />
        {/* Left Image */}
        <img
          className="w-full h-full object-cover rounded-lg border col-span-1 row-span-1"
          src="https://digital-world-2.myshopify.com/cdn/shop/files/Red_and_Yellow_Classic_Neutrals_Cooking_Set_Product_Summer_Instagram_Post_280_x_338_px_1_cd2b3108-c6f2-4ee5-9597-8a501c61f0d6_400x.png?v=1750861662"
          alt=""
        />

        {/* Ảnh phải */}
      </div>
    </div>
  );
};

export default FeatureProducts;
