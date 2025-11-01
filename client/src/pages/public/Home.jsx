import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Banner from "../../components/Home/Banner";
import { IoIosArrowForward } from "react-icons/io";
import { useProductStore } from "@/lib/zustand/useProductStore";
import DealDaily from "@/components/Home/DealDaily";
import BestSeller from "@/components/Home/BestSeller";
import CustomSlider from "@/components/Common/CustomSlider";
import FeatureProducts from "@/components/Home/FeatureProducts";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { Newspaper } from "lucide-react";
import { apiGetProducts } from "@/apis/product";

const Home = () => {
  const { productCategories, fetchProductsCategory } = useProductStore();
  const { checkAuth } = useAuthStore();
  const [highRatingProducts, setHighRatingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch sản phẩm có rating cao
  const fetchHighRating = async () => {
    try {
      setLoading(true);
      const response = await apiGetProducts({ sort: "-totalRatings" });
      if (response.success && response.products) {
        setHighRatingProducts(response.products.slice(0, 10)); // lấy top 10
      }
    } catch (error) {
      console.error("Failed to fetch high rating products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsCategory();
    checkAuth();
    fetchHighRating();
  }, []);

  // ✅ Đồng bộ giỏ hàng giữa tab
  useEffect(() => {
    const channel = new BroadcastChannel("cart_sync");
    channel.onmessage = (event) => {
      if (event.data.type === "CART_CLEARED") {
        window.location.reload();
      }
    };
    return () => channel.close();
  }, []);

  return (
    <div className="w-main mt-6">
      <div className="flex">
        <div className="flex flex-col gap-5 flex-auto w-[25%]">
          <Sidebar />
          <DealDaily />
        </div>
        <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto">
          <Banner />
          <BestSeller />
        </div>
      </div>

      {/* Feature Products */}
      <div className="my-8">
        <FeatureProducts />
      </div>

      {/* High Rating Section */}
      <div className="my-8 w-full">
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
      </div>

      {/* Hot Collections */}
      <div className="w-full h-[500px]">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase">
          Hot Collections
        </h3>
        <div className="flex flex-wrap gap-4 mt-4">
          {productCategories
            ?.filter((el) => el.brand.length > 0)
            ?.map((category) => (
              <div key={category?._id} className="w-[396px]">
                <div className="border flex p-4 gap-4">
                  <img
                    src={category?.image}
                    alt={category?.id}
                    className="w-[144px] min-h-[190px] object-cover"
                  />
                  <div className="flex-1 text-gray-700">
                    <h4 className="font-semibold uppercase">
                      {category?.title}
                    </h4>
                    <ul>
                      {category?.brand.map((item) => (
                        <span
                          className="flex gap-1 items-center text-gray-500"
                          key={item}
                        >
                          <IoIosArrowForward />
                          <li>{item}</li>
                        </span>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Blog Section */}
      <div className="my-8 w-full">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase">
          BLOG POSTS
        </h3>
        <div className="flex flex-col items-center justify-center h-[300px] bg-gray-50 rounded-lg mt-4 border border-dashed border-gray-300">
          <Newspaper size={48} className="text-gray-400 mb-4" />
          <h4 className="text-xl font-semibold text-gray-700">
            Blog Posts Coming Soon!
          </h4>
          <p className="text-gray-500 mt-2">
            We're working hard to bring you fresh content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
