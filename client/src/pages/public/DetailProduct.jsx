import React, { useCallback, useEffect, useState } from "react";
import { useProductStore } from "@/lib/zustand/useProductStore";
import { useParams } from "react-router-dom";

import Breadcrumbs from "@/components/Breadcrumbs";
import ImageZoom from "@/components/Product/ImageZoom";
import Carousel from "@/components/Common/Carousel";
import Button from "@/components/Common/Button";
import QuantitySelection from "@/components/Product/QuantitySelection";
import ProductExtraInfo from "@/components/Product/ProductExtraInfo";
import CustomSlider from "@/components/Common/CustomSlider";

import { formatMoney } from "@/ultils/helpers";
import { ProductExtraInformation } from "@/ultils/constants";
import { apiGetProducts } from "@/apis/product";

import StarRating from "@/components/StarRating";
import Tabs from "@/components/Product/Tabs";
import { tabsData } from "@/components/Product/tabsData";

const DetailProduct = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState(null);
  // Get Params From URL
  const { pid, title, category } = useParams();
  const { fetchProductById, selectedProduct, isLoading } = useProductStore();
  // Call API
  const fetchProductsByCategory = async (category) => {
    try {
      const response = await apiGetProducts({ category });
      if (response.success) {
        setRelatedProducts(response.products);
      }
    } catch (error) {
      console.error("Fetch related products failed:", error);
    }
  };
  // Fetch API
  useEffect(() => {
    if (pid && category) {
      fetchProductById(pid);
      fetchProductsByCategory(category);
    }
  }, [category, fetchProductById, pid]);

  // Reload the data when user finished review
  const reloadProduct = useCallback(async () => {
    if (pid) {
      await fetchProductById(pid);
    }
  }, [pid, fetchProductById]);

  // Assign current Image to Product Thumb
  useEffect(() => {
    if (selectedProduct?.thumb) {
      setCurrentImage(selectedProduct.thumb);
    }
    console.log(selectedProduct);
  }, [selectedProduct]);

  const handleChangeImage = (e, src) => {
    e.stopPropagation();
    setCurrentImage(src);
  };

  return (
    <div className="w-full">
      <div className="h-[81px] w-full flex justify-center items-center bg-gray-100">
        <div className="w-main">
          <h3>{title}</h3>
          <Breadcrumbs title={title} category={category} />
        </div>
      </div>
      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="w-main m-auto mt-6 flex gap-10 animate-pulse">
          <div className="w-2/5 flex flex-col gap-4">
            <div className="w-full h-[458px] bg-gray-300 rounded-lg" />
            <div className="w-full h-[120px] bg-gray-300 rounded-lg" />
          </div>

          <div className="w-2/5 flex flex-col gap-4">
            <div className="w-[200px] h-[30px] bg-gray-300 rounded" />
            <div className="w-full h-[150px] bg-gray-300 rounded" />
            <div className="w-full h-[50px] bg-gray-300 rounded" />
            <div className="w-full h-[40px] bg-gray-300 rounded" />
          </div>

          <div className="w-1/5 flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full h-[30px] bg-gray-300 rounded" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="w-main m-auto mt-6 flex gap-20">
            <div className="w-2/5 flex flex-col gap-4">
              <div className="w-[458px] h-[458px]">
                <ImageZoom
                  src={currentImage}
                  alt={selectedProduct?.title}
                  zoomLevel={3}
                  className="border border-gray-200 rounded"
                />
              </div>
              <div className="w-[470px] mt-6 mb-[200px]">
                <Carousel
                  onImageClick={handleChangeImage}
                  images={selectedProduct?.images}
                  showDots={true}
                  autoplayEnabled={true}
                />
              </div>
            </div>

            {/* Thông tin sản phẩm */}
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
                  <div className="flex items-center gap-1 mt-8">
                    <StarRating
                      rating={selectedProduct?.totalRatings}
                      size={25}
                    />
                    <span className="text-md text-main italic">{`(${selectedProduct?.ratings?.length} reviews)`}</span>
                  </div>
                </div>
                <ul className="list-[square] text-sm text-gray-500 pl-4 mt-5">
                  {selectedProduct?.description?.map((el) => (
                    <li key={el} className="leading-4 mt-6">
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

            {/* Cột thông tin */}
            <div className="w-1/5">
              {ProductExtraInformation.map((product) => (
                <ProductExtraInfo key={product.id} productExtraInfo={product} />
              ))}
            </div>
          </div>

          {/* Tabs & Slider */}
          <div className="w-main m-auto mt-8">
            <Tabs
              data={tabsData}
              averageRatings={selectedProduct?.totalRatings}
              reviews={selectedProduct?.ratings}
              productId={pid}
              onReload={reloadProduct}
            />
          </div>

          <div className="w-main m-auto mt-8">
            <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase">
              Other customers also liked
            </h3>

            {!isLoading ? (
              <div className="mt-8">
                <CustomSlider products={relatedProducts} normal />
              </div>
            ) : (
              <div className="mt-6 animate-pulse">
                <div className="w-full h-[250px] bg-gray-300 rounded-lg" />
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
