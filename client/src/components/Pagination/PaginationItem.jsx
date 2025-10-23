import React from "react";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const PaginationItem = ({ children }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { pathname } = useLocation();
  const handlePagination = () => {
    const queries = Object.fromEntries([...params]);
    if (Number(children)) queries.page = children;

    navigate({
      pathname: pathname,
      search: createSearchParams(queries).toString(),
    });
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
