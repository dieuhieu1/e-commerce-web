import React, { useCallback, useEffect, useState } from "react";
import { useProductStore } from "@/lib/zustand/useProductStore";
import { useNavigate, useParams } from "react-router-dom";

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

import DOMPurify from "dompurify";
const DetailProduct = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [variant, setVariant] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({
    title: "",
    thumb: {},
    images: [],
    price: "",
    color: "",
  });
  const navigate = useNavigate();

  // Get Params From URL
  const { pid, category } = useParams();
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
  useEffect(() => {
    if (variant && selectedProduct?.variants) {
      const selectedVariant = selectedProduct.variants.find(
        (el) => el.sku === variant
      );
      console.log(selectedVariant);

      if (selectedVariant) {
        setCurrentProduct({
          title: selectedVariant.title,
          thumb: selectedVariant.thumb,
          images: selectedVariant.images,
          price: selectedVariant.price,
          color: selectedVariant.color,
        });
      }
    } else {
      setCurrentProduct({
        title: "",
        thumb: {},
        images: [],
        price: "",
        color: "",
      });
    }
  }, [variant, selectedProduct]);
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
    const image = currentProduct?.thumb?.image_url
      ? currentProduct.thumb
      : selectedProduct?.thumb;
    if (image) setCurrentImage(image);
  }, [currentProduct, selectedProduct]);

  const handleChangeImage = (e, src) => {
    e.stopPropagation();
    setCurrentImage(src);
  };

  return (
    <div className="w-full">
      <div className="h-[81px] w-full flex justify-center items-center bg-gray-100">
        <div className="w-main">
          <h3>{currentProduct.title || selectedProduct?.title}</h3>
          <Breadcrumbs />
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
              <div className="w-[458px] h-[458px] mb-10">
                {/* Ảnh chính */}
                <ImageZoom
                  src={currentImage?.image_url}
                  alt={currentProduct.title || selectedProduct?.title}
                  zoomLevel={3}
                  className="border border-gray-200 rounded"
                />
              </div>
              <div className="w-[470px] mt-6 mb-[200px]">
                {/* Carousel hình ảnh */}
                <Carousel
                  onImageClick={handleChangeImage}
                  images={
                    currentProduct?.images?.length
                      ? currentProduct.images
                      : selectedProduct?.images
                  }
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
                    {formatMoney(
                      Number(currentProduct.price || selectedProduct?.price)
                    )}{" "}
                    VND
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
                  {selectedProduct?.description?.length > 1 &&
                    selectedProduct?.description?.map((el) => (
                      <li key={el} className="leading-4 mt-6">
                        {el}
                      </li>
                    ))}
                  {selectedProduct?.description?.length === 1 && (
                    <div
                      className="text-sm line-clamp-[20]"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          selectedProduct?.description[0]
                        ),
                      }}
                    ></div>
                  )}
                </ul>
                {/* Variant selection */}
                <div className="flex gap-3 flex-wrap mt-4">
                  <span className="font-bold">Color:</span>
                  <div className="flex flex-wrap gap-4 items-center w-full">
                    <div
                      onClick={() => {
                        setVariant(null);
                        navigate(
                          `/${category}/${pid}/${selectedProduct.title.replace(
                            /\s+/g,
                            ""
                          )}`
                        );
                      }}
                      className={`flex items-center gap-2 p-2 border cursor-pointer ${
                        !variant && "border-red-500"
                      }`}
                    >
                      <img
                        src={selectedProduct?.thumb.image_url}
                        alt={`product_${selectedProduct?.thumb?.public_id}`}
                        className="w-8 h-8 rounded-md object-cover"
                      />
                      <span className="flex flex-col">
                        {" "}
                        <span>{selectedProduct?.color}</span>
                        <span className="text-sm">
                          {selectedProduct?.price}
                        </span>
                      </span>
                    </div>
                    {selectedProduct?.variants?.map((el) => (
                      <div
                        onClick={() => {
                          setVariant(el.sku);
                          navigate(
                            `/${category}/${pid}/${el.title.replace(
                              /\s+/g,
                              ""
                            )}`
                          );
                        }}
                        className={`flex items-center gap-2 p-2 border cursor-pointer ${
                          variant === el.sku && "border-red-500"
                        }`}
                      >
                        <img
                          src={el?.thumb.image_url}
                          alt={`product_${el?.thumb?.public_id}`}
                          className="w-8 h-8 rounded-md object-cover"
                        />
                        <span className="flex flex-col">
                          {" "}
                          <span>{el.color}</span>
                          <span className="text-sm">{el?.price}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Quantity and Add to Cart Btn */}
                <div className="flex flex-col gap-8 mt-10">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold">Quantity:</span>
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
