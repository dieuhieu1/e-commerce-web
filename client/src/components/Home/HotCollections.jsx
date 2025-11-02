import { useProductStore } from "@/lib/zustand/useProductStore";
import { useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { createSearchParams, useNavigate } from "react-router-dom";

const HotCollections = () => {
  const navigate = useNavigate();
  const { productCategories, fetchProductsCategory } = useProductStore();

  useEffect(() => {
    fetchProductsCategory();
  }, []);

  return (
    <>
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
                  <h4 className="font-semibold uppercase">{category?.title}</h4>
                  <ul>
                    {category?.brand.map((item) => (
                      <span
                        className="flex gap-1 items-center text-gray-500 hover:underline cursor-pointer hover:text-blue-950"
                        key={item}
                        onClick={() =>
                          navigate({
                            pathname: `/${category?.title}`,
                            search: createSearchParams({
                              brand: item,
                            }).toString(),
                          })
                        }
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
    </>
  );
};

export default HotCollections;
