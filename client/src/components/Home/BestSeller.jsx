import { useEffect, useState } from "react";

import { useProductStore } from "@/lib/zustand/useProductStore";
import CustomSlider from "../Common/CustomSlider";

const tabs = [
  { id: 1, name: "best sellers" },
  { id: 2, name: "new arrivals" },
];

const BestSeller = () => {
  const { fetchBestSellers, fetchNewArrivals, bestSellers, newArrivals } =
    useProductStore();

  const [activedTab, setActivedTab] = useState(1);
  const [products, setProducts] = useState(null);
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    fetchBestSellers();
    fetchNewArrivals();
  }, [fetchBestSellers, fetchNewArrivals]);

  useEffect(() => {
    if (activedTab === 1) {
      setProducts(bestSellers);
    }
    if (activedTab === 2) {
      setProducts(newArrivals);
    }
  }, [activedTab, bestSellers, newArrivals]);
  return (
    <div>
      <div className="flex text-[24px] gap-8 border-b-2 pb-4 border-main mb-[20px]">
        {tabs.map((el) => (
          <span
            className={`font-semibold text-xl pr-8 uppercase border-r cursor-pointer ${
              activedTab === el.id ? "text-black" : "text-gray-400"
            }`}
            key={el.id}
            onClick={() => {
              setActivedTab(el.id);
              setIsNew((isNew) => !isNew);
            }}
          >
            {el.name}
          </span>
        ))}
      </div>
      {products?.length > 0 ? (
        <CustomSlider products={products} isNew={isNew} />
      ) : (
        <p className="text-center text-gray-400 py-8">Đang tải sản phẩm...</p>
      )}
      <div className="w-full flex gap-4 mt-10">
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/promo-23_2000x_crop_center.png?v=1750842393"
          alt="banner-1"
          className="flex-1 object-contain"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/promo-24_2000x_crop_center.png?v=1750842410"
          alt="banner-1"
          className="flex-1 object-contain"
        />
      </div>
    </div>
  );
};

export default BestSeller;
