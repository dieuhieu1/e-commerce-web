import Sidebar from "../../components/Common/Sidebar";
import Banner from "../../components/Home/Banner";
import { IoIosArrowForward } from "react-icons/io";
import { useProductStore } from "@/lib/zustand/useProductStore";
import { useEffect } from "react";
import DealDaily from "@/components/Home/DealDaily";
import BestSeller from "@/components/Home/BestSeller";
import FeatureProducts from "@/components/FeatureProducts";
import CustomSlider from "@/components/Common/CustomSlider";

const Home = () => {
  const { newArrivals, productCategories, fetchProductsCategory } =
    useProductStore();
  useEffect(() => {
    fetchProductsCategory();
  }, []);

  return (
    <div className="w-main mt-6">
      <div className=" flex ">
        <div className="flex flex-col gap-5 flex-auto w-[25%]">
          <Sidebar />
          <DealDaily />
        </div>
        <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto">
          <Banner />
          <BestSeller />
        </div>
      </div>
      <div className="my-8">
        <FeatureProducts />
      </div>
      <div className="my-8 w-full">
        <h3 className="uppercase font-semibold py-[15px] border-b-2 border-main text-[20px]">
          new arrivals
        </h3>
        <div className="mt-4">
          <CustomSlider products={newArrivals} />
        </div>
      </div>
      <div className="w-full h-[500px]">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main  uppercase">
          hot collections
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
      <div className="my-8 w-full">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
          BLOG POSTS
        </h3>
      </div>
      <div className="w-full h-[500px]"></div>
    </div>
  );
};

export default Home;
