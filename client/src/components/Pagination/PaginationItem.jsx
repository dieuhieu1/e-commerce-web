import React from "react";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

const PaginationItem = ({ children }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { category } = useParams;
  const handlePagination = () => {
    let param = [];

    for (let i of params.entries()) {
      param.push(i);
    }

    const queries = {};
    for (let i of param) {
      queries[i[0]] = i[1];
    }
    if (Number(children)) queries.page = children;
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
  };
  return (
    <button
      className={`p-4 hover:rounded-full hover:bg-gray-300 w-10 h-10 flex items-center justify-center ${
        +params.get("page") === +children ? "rounded-full bg-red-500" : ""
      }`}
      onClick={handlePagination}
      type="button"
      disabled={!Number(children)}
    >
      {children}
    </button>
  );
};

export default PaginationItem;
