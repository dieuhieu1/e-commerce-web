import { apiGetProducts } from "@/apis/product";
import { useDebounce } from "@/hooks/useDebounce";
import { colors } from "@/ultils/constants";
import React, { memo, useCallback, useEffect, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Swal from "sweetalert2";

const SearchItem = ({
  name,
  activeClick,
  changeActiveFilter,
  type = "checkbox",
}) => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [params] = useSearchParams();
  const [selected, setSelected] = useState([]);
  const [bestPrice, setBestPrice] = useState(null);
  const [price, setPrice] = useState({ from: 0, to: 0 });
  const debouncePriceFrom = useDebounce(price.from, 600);
  const debouncePriceTo = useDebounce(price.to, 600);
  const formatCurrency = (num) => {
    if (!num) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseCurrency = (str) => {
    if (!str) return 0;
    return Number(str.replace(/\./g, ""));
  };
  // Handle checkbox selection
  const handleSelect = (e) => {
    const value = e.target.value;
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    changeActiveFilter(null);
  };

  // Reset all filters
  const handleReset = (e) => {
    e.stopPropagation();
    if (type === "input") {
      setPrice({ from: 0, to: 0 });
    } else {
      setSelected([]);
    }
    changeActiveFilter(null);
  };

  // Fetch the product with the highest price
  const fetchBestPriceProduct = async () => {
    const response = await apiGetProducts({ sort: "-price", limit: 1 });
    if (response.success) {
      setBestPrice(response.products[0].price);
    }
  };

  // Handle input change with validation (using SweetAlert)
  const handlePriceChange = useCallback((e, field) => {
    const raw = e.target.value;
    const numericValue = parseCurrency(raw);

    if (numericValue < 0) return;

    setPrice((prev) => ({ ...prev, [field]: numericValue }));
  }, []);

  useEffect(() => {
    if (type !== "input") return;

    // Validation logic here
    if (debouncePriceFrom && debouncePriceTo) {
      if (debouncePriceFrom > debouncePriceTo) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "'From' value cannot be greater than 'To' value!",
        }).then(() => {
          setPrice({ from: 0, to: 0 });
        });
        return;
      }
    }

    if (debouncePriceTo > bestPrice) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `'To' value cannot exceed ${Number(
          bestPrice
        ).toLocaleString()} VND!`,
      }).then(() => {
        setPrice((prev) => ({ ...prev, to: 0 }));
      });
      return;
    }
  }, [debouncePriceTo, debouncePriceFrom]);

  // Sync color filter to URL params
  useEffect(() => {
    let param = [];
    for (let i of params.entries()) param.push(i);
    const queries = {};
    for (let i of param) queries[i[0]] = i[1];

    if (selected.length > 0) {
      queries.color = selected.join(",");
    } else {
      delete queries.color;
    }
    delete queries.page;
    if (category) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams(queries).toString(),
      });
    } else {
      navigate({
        pathname: "/products",
        search: createSearchParams(queries).toString(),
      });
    }
  }, [selected]);

  // Fetch best price on mount
  useEffect(() => {
    if (type === "input") {
      fetchBestPriceProduct();
    }
  }, [type]);
  // Update URL when price changes (with debounce)
  useEffect(() => {
    let param = [];
    for (let i of params.entries()) param.push(i);
    const queries = {};
    for (let i of param) queries[i[0]] = i[1];

    if (Number(debouncePriceFrom) > 0) {
      queries.from = debouncePriceFrom;
    } else {
      delete queries.from;
    }
    if (Number(debouncePriceTo) > 0) {
      queries.to = debouncePriceTo;
    } else {
      delete queries.to;
    }
    if (category) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams(queries).toString(),
      });
    } else {
      navigate({
        pathname: "/products",
        search: createSearchParams(queries).toString(),
      });
      return;
    }
  }, [debouncePriceTo, debouncePriceFrom]);

  return (
    <div
      className="p-3 text-gray-500 border gap-6 border-gray-300 flex justify-between items-center relative text-xs"
      onClick={() => changeActiveFilter(name)}
    >
      <span className="capitalize">{name}</span>
      <AiOutlineDown />

      {activeClick === name && (
        <div
          className="absolute top-[calc(100%+10px)] left-0 w-fit p-4 border bg-white min-w-[250px] z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {type === "checkbox" && (
            <div>
              <div className="py-2 flex justify-between items-center border-b text-gray-700">
                <span>{selected.length} selected</span>
                <span
                  className="underline cursor-pointer hover:text-main"
                  onClick={handleReset}
                >
                  Reset
                </span>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                {colors.map((el, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={el.name}
                      value={el.value}
                      checked={selected.includes(el.value)}
                      onChange={handleSelect}
                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 checked:bg-blue-500"
                    />
                    <label htmlFor={el} className="capitalize text-gray-700">
                      {el.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {type === "input" && (
            <div>
              <div className="py-4 flex justify-between items-center border-b text-gray-700 gap-8">
                <span className="whitespace-nowrap">
                  {`Highest price: ${Number(bestPrice).toLocaleString()} VND`}
                </span>
                <span
                  className="underline cursor-pointer hover:text-main"
                  onClick={handleReset}
                >
                  Reset
                </span>
              </div>
              <div className="flex items-center p-2 gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="from">From</label>
                  <input
                    type="text"
                    id="from"
                    className="form-input"
                    value={formatCurrency(price.from) || ""}
                    onChange={(e) => handlePriceChange(e, "from")}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="to">To</label>
                  <input
                    type="text"
                    id="to"
                    className="form-input"
                    value={formatCurrency(price.to) || ""}
                    onChange={(e) => handlePriceChange(e, "to")}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(SearchItem);
