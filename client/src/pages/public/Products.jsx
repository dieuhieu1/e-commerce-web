import React, { useCallback, useEffect, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import Masonry from "react-masonry-css";
import Product from "@/components/Product/Product";
import SearchItem from "@/components/Search/SearchItem";
import { apiGetProducts } from "@/apis/product";
import InputSelect from "@/components/Input/InputSelect";
import { sorts } from "@/ultils/constants";
import Pagination from "@/components/Pagination/Pagination";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const Products = () => {
  const navigate = useNavigate();

  const [activeClick, setActiveClick] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [sort, setSort] = useState("");

  const [params] = useSearchParams();

  useEffect(() => {
    const queries = Object.fromEntries(params.entries());
    let priceQuery = {};
    if (queries.to && queries.from) {
      priceQuery = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } },
        ],
      };
      delete queries.price;
    }
    if (queries.from) {
      queries.price = { gte: queries.from };
    }
    if (queries.to) {
      queries.price = { lte: queries.to };
    }
    delete queries.from;
    delete queries.to;

    const queryObject =
      Object.keys(queries).length === 0 ? {} : { ...priceQuery, ...queries };

    const loadProducts = async () => {
      setIsLoading(true);
      const response = await apiGetProducts(queryObject);

      if (response.success) {
        setProductsByCategory(response);
      }
      setIsLoading(false);
    };
    loadProducts();
    window.scrollTo(0, 0);
  }, [params]);

  const changeActiveFilter = useCallback(
    (name) => {
      if (activeClick === name) {
        setActiveClick(null);
      } else {
        setActiveClick(name);
      }
    },
    [activeClick]
  );
  useEffect(() => {
    if (sort) {
      navigate({
        pathname: "/products",
        search: createSearchParams({ sort }).toString(),
      });
    }
  }, [navigate, sort]);
  const changeSorts = useCallback(
    (value) => {
      setSort(value);
    },
    [sort]
  );
  return (
    <div className="w-full">
      <div className="w-main border p-4 flex justify-between mt-8 m-auto">
        <div className="w-4/5 flex-auto p-4 flex flex-col gap-3">
          <span className="font-semibold text-sm">Filter By</span>
          <div className="flex items-center gap-4">
            <SearchItem
              name="Price"
              type="input"
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
            />
            <SearchItem
              name="Color"
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
            />
          </div>
        </div>
        <div className="w-1/5 flex flex-col gap-3">
          <span className="font-semibold text-sm">Sort By</span>
          <div className="w-full">
            <InputSelect
              value={sort}
              options={sorts}
              changeValue={changeSorts}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 w-main m-auto">
        {isLoading ? (
          // 🟢 Hiệu ứng loading
          <div className="grid grid-cols-4 gap-6 animate-pulse">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded-lg h-[400px] w-full"
                >
                  <div className="h-[300px] bg-gray-300 rounded-t-lg"></div>
                  <div className="p-3 space-y-3">
                    <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                    <div className="w-full h-6 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {productsByCategory &&
              productsByCategory?.products?.map((el) => (
                <Product
                  key={el._id}
                  pid={el._id}
                  productData={el}
                  normal={true}
                />
              ))}
          </Masonry>
        )}
      </div>
      <div className="w-main m-auto my-4 flex justify-end">
        <Pagination totalCount={productsByCategory?.totalCount} pageSize={10} />
      </div>
    </div>
  );
};

export default Products;
