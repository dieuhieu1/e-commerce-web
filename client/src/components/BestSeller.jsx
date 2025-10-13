import { useEffect, useState } from "react";
import { apiGetProducts } from "@/apis/product";
import Slider from "react-slick";
import Product from "./Product";
import Arrow from "./Arrow";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const tabs = [
  { id: 1, name: "best sellers" },
  { id: 2, name: "new arrivals" },
];
var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 2,
  nextArrow: <Arrow icon={<FaChevronRight />} position="right" />,
  prevArrow: <Arrow icon={<FaChevronLeft />} position="left" />,
};
const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState(null);
  const [newArrivalProducts, setNewArrivalProducts] = useState(null);
  const [activedTab, setActivedTab] = useState(1);
  const [products, setProducts] = useState(null);
  const [isNew, setIsNew] = useState(true);
  const fetchProducts = async () => {
    const response = await Promise.all([
      apiGetProducts({ sort: "-sold" }),
      apiGetProducts({ sort: "createdAt" }),
    ]);
    console.log(response);

    if (response[0]?.success) {
      setBestSellers(response[0].products);
      setProducts(response[0].products);
    }
    if (response[1].products) {
      setNewArrivalProducts(response[1].products);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    if (activedTab === 1) {
      setProducts(bestSellers);
    }
    if (activedTab === 2) {
      setProducts(newArrivalProducts);
    }
  }, [activedTab, bestSellers, newArrivalProducts]);
  return (
    <div>
      <div className="flex text-[24px] gap-8 border-b-2 pb-4 border-main mb-[20px]">
        {tabs.map((el) => (
          <span
            className={`font-semibold pr-8 capitalize border-r cursor-pointer ${
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
        <Slider {...settings} className="!mx-[-10px]">
          {products.map((el) => (
            <div key={el._id} className="px-3">
              <Product productData={el} isNew={isNew} />
            </div>
          ))}
        </Slider>
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
