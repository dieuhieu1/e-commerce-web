import React, { useCallback, useEffect, useState } from "react";
import { useProductStore } from "@/lib/zustand/useProductStore";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import Breadcrumbs from "@/components/Breadcrumbs";
import ImageZoom from "@/components/Product/ImageZoom";
import Carousel from "@/components/Common/Carousel";
import Button from "@/components/Common/Button";
import QuantitySelection from "@/components/Product/QuantitySelection";
import ProductExtraInfo from "@/components/Product/ProductExtraInfo";
import CustomSlider from "@/components/Common/CustomSlider";

import { formatCurrency, formatMoney } from "@/ultils/helpers";
import { ProductExtraInformation } from "@/ultils/constants";
import { apiGetProducts } from "@/apis/product";

import StarRating from "@/components/StarRating";
import Tabs from "@/components/Product/Tabs";
import { tabsData } from "@/components/Product/tabsData";

import DOMPurify from "dompurify";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import path from "@/ultils/path";
import { CustomDialog } from "@/components/Dialog/CustomDialog";
import { apiUpdateUserCart } from "@/apis/user";
import toast from "react-hot-toast";
const DetailProduct = () => {
  const location = useLocation();

  // --- COMPONENT STATE ---
  const [currentImage, setCurrentImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [variant, setVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Toggles the "Please Login" modal

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

  // Get user state and auth-checking function from Zustand store
  const { user, checkAuth } = useAuthStore();
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

  // Scroll To Top Smooth
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pid]);

  // Fetch API
  useEffect(() => {
    if (pid && category) {
      fetchProductById(pid);
      fetchProductsByCategory(category);
    }
  }, [category, fetchProductById, pid]);

  // Get Varaint Data
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

  // Assign current Image to Product Thumb
  useEffect(() => {
    const image = currentProduct?.thumb?.image_url
      ? currentProduct.thumb
      : selectedProduct?.thumb;
    if (image) setCurrentImage(image);
  }, [currentProduct, selectedProduct]);

  // Reload the data when user finished review
  const reloadProduct = useCallback(async () => {
    if (pid) {
      await fetchProductById(pid);
    }
  }, [pid, fetchProductById]);

  const handleChangeImage = (e, src) => {
    e.stopPropagation();
    setCurrentImage(src);
  };

  const handleAddToCart = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    console.log(user);

    const color = currentProduct.color
      ? currentProduct.color
      : selectedProduct.color;
    const price = currentProduct.price
      ? currentProduct.price
      : selectedProduct.price;
    const thumb = currentProduct.thumb.image_url
      ? currentProduct.thumb.image_url
      : selectedProduct.thumb.image_url;
    const title = currentProduct.title
      ? currentProduct.title
      : selectedProduct.title;
    const data = {
      color: color,
      quantity: quantity,
      price: price,
      thumb: thumb,
      title: title,
    };
    const productId = selectedProduct._id;
    console.log(data);
    const response = await apiUpdateUserCart(productId, data);

    if (response.success) {
      toast.success(response.message);
      checkAuth(); // Re-fetch user data to update cart state globally
    } else {
      toast.error(response.message);
    }
  };

  const handleConfirmLoginModal = () => {
    navigate({
      pathname: `/${path.LOGIN}`,
      search: createSearchParams({ redirect: location.pathname }).toString(),
    });
    setIsLoginModalOpen(false);
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
              <div className="w-[458px] h-[458px] mb-10 flex justify-center items-center border border-gray-200 rounded bg-white overflow-hidden">
                {/* Ảnh chính */}
                <ImageZoom
                  src={currentImage?.image_url || currentImage}
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
                        <span>{selectedProduct?.color || "Black"}</span>
                        <span className="text-sm">
                          {formatCurrency(selectedProduct?.price)} VND
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
                        key={el.sku}
                      >
                        <img
                          src={el?.thumb.image_url}
                          alt={`product_${el?.thumb?.public_id}`}
                          className="w-8 h-8 rounded-md object-cover"
                        />
                        <span className="flex flex-col">
                          {" "}
                          <span>{el?.color || "Black"}</span>
                          <span className="text-sm">
                            {formatCurrency(el?.price)} VND
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Quantity and Add to Cart Btn */}
                <div className="flex flex-col gap-8 mt-10">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold">Quantity:</span>
                    <QuantitySelection
                      max={selectedProduct?.quantity}
                      quantity={quantity}
                      setQuantity={setQuantity}
                    />
                  </div>
                  <Button
                    className="cursor-pointer"
                    fullWidth
                    onClick={handleAddToCart}
                  >
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

      {/* Login Required Dialog */}
      <CustomDialog
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="Login Required!"
        confirmText="Go to Login Page"
        cancelText="Not now!"
        onConfirm={handleConfirmLoginModal}
        // The "Not now" (cancel) button should close *this* modal
        onClose={() => setIsLoginModalOpen(false)}
      >
        <p className="text-gray-700 text-md">
          Please login your account Digital World to add product to your own
          cart.
        </p>
      </CustomDialog>

      <div className="h-[100px] w-full"></div>
    </div>
  );
};

export default DetailProduct;
