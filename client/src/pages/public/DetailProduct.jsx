import React, { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useProductStore } from "@/lib/zustand/useProductStore";
import { useParams } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import ImageZoom from "@/components/UI/ImageZoom";
import Carousel from "@/components/Carousel";
import Button from "@/components/UI/Button";
import QuantitySelection from "@/components/UI/QuantitySelection";
import ProductInfo from "@/components/Product/ProductInfo";
import Tabs from "@/components/Tabs";
import CustomSlider from "@/components/UI/CustomSlider";
import { formatMoney } from "@/ultils/helpers";
import { productInformation } from "@/ultils/constants";
import { tabsData } from "@/ultils/tabsData";

const DetailProduct = () => {
  const { pid, title, category } = useParams();
  const {
    fetchProductById,
    fetchProductsByCategory,
    productsByCategory,
    selectedProduct,
    isLoading,
  } = useProductStore();

  useEffect(() => {
    if (pid) {
      console.log(pid);

      fetchProductById(pid);
      fetchProductsByCategory(category);
    }
  }, [pid]);

  return (
    <div className="w-full">
      <div className="h-[81px] w-full flex justify-center items-center bg-gray-100">
        <div className="w-main">
          <h3>{title}</h3>
          <Breadcrumbs title={title} category={category} />
        </div>
      </div>

      {/* 🟢 Loading Skeleton */}
      {isLoading ? (
        <div className="w-main m-auto mt-6 flex gap-10 animate-pulse">
          <div className="w-2/5 flex flex-col gap-4">
            <Skeleton height={458} />
            <Skeleton height={120} />
          </div>
          <div className="w-2/5 flex flex-col gap-6">
            <Skeleton height={30} width={200} />
            <Skeleton count={6} />
            <Skeleton height={50} width={"100%"} />
          </div>
          <div className="w-1/5 flex flex-col gap-4">
            <Skeleton count={5} />
          </div>
        </div>
      ) : (
        <>
          {/* 🟢 Hiển thị thật khi đã load */}
          <div className="w-main m-auto mt-4 flex gap-10">
            <div className="w-2/5 flex flex-col gap-4">
              <div className="w-[458px] h-[458px]">
                <ImageZoom
                  src={selectedProduct?.thumb}
                  alt={selectedProduct?.title}
                  zoomLevel={3}
                  className="border border-gray-200 rounded"
                />
              </div>
              <div className="w-[470px] mt-6 mb-[200px]">
                <Carousel
                  images={selectedProduct?.images}
                  showDots
                  autoplayEnabled
                />
              </div>
            </div>

            <div className="w-2/5">
              <div className="h-[458px] flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-semibold italic text-gray-900">
                    {formatMoney(Number(selectedProduct?.price))} VND
                  </h2>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-main font-semibold text-xl">
                      In Stock: {selectedProduct?.quantity}
                    </span>
                    <span className="text-gray-600 font-medium text-2xl">
                      Sold: {selectedProduct?.sold}
                    </span>
                  </div>
                </div>
                <ul className="list-[square] text-sm text-gray-500 pl-4 mt-5">
                  {selectedProduct?.description?.map((el) => (
                    <li key={el} className="leading-4 mt-2">
                      {el}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-8 mt-10">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold">Quantity</span>
                    <QuantitySelection max={selectedProduct?.quantity} />
                  </div>
                  <Button className="cursor-pointer" fullWidth>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-1/5">
              {productInformation.map((product) => (
                <ProductInfo key={product.id} productInfo={product} />
              ))}
            </div>
          </div>

          <div className="w-full m-auto mt-8">
            <Tabs data={tabsData} />
          </div>

          <div className="w-main m-auto mt-8">
            <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase">
              Other customers also liked
            </h3>

            {!isLoading && productsByCategory[category]?.length > 0 ? (
              <CustomSlider products={productsByCategory[category]} normal />
            ) : (
              <div className="mt-6">
                <Skeleton height={250} count={1} />
              </div>
            )}
          </div>
        </>
      )}
      <div className="h-[100px] w-full"></div>
    </div>
  );
};

export default DetailProduct;
