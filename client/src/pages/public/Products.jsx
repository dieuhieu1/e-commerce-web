import Breadcrumbs from "@/components/Breadcrumbs";
import { useProductStore } from "@/lib/zustand/useProductStore";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const Products = () => {
  const { category } = useParams();
  const { fetchProductsByCategory, productsByCategory } = useProductStore();
  useEffect(() => {
    fetchProductsByCategory(category);
  }, []);
  return (
    <div className="w-full">
      <div className="h-[81px] flex justify-center items-center bg-gray-100">
        <div className="w-main">
          <h1 className="font-semibold uppercase">{category}</h1>
          <Breadcrumbs category={category} />
        </div>
      </div>
      <div className="w-main border p-4 flex justify-between mt-8">
        <div className="w-4/5 flex-auto">Filter</div>
        <div className="w-1/5 flex">Sort By</div>
      </div>
      <div className="w-full h-[500px]"></div>
    </div>
  );
};

export default Products;
