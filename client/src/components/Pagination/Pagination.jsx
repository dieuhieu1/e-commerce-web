import { DOTS, usePagination } from "@/hooks/usePagination";
import React from "react";
import PaginationItem from "./PaginationItem";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";

const Pagination = ({ totalCount }) => {
  const [params] = useSearchParams();
  const currentPage = +params.get("page");
  const pagination = usePagination(totalCount, currentPage);
  const range = () => {
    const currentPage = +params.get("page");
    const pageSize = +import.meta.env.REACT_APP_PRODUCT_LIMIT || 10;
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);
    return `${start} - ${end}`;
  };

  return (
    <div className="flex w-main justify-between items-center ">
      {!+params.get("page") && (
        <span className="text-sm italic">{`Show products 1 - ${
          +import.meta.env.REACT_APP_PRODUCT_LIMIT || 10
        }`}</span>
      )}
      {+params.get("page") && (
        <span className="text-sm italic">{`Show products ${range()} of ${totalCount}`}</span>
      )}
      <div className="flex items-center gap-4">
        {pagination &&
          pagination.map((el, index) => (
            <PaginationItem el={el} key={`${el}-${index}`}>
              {el === DOTS ? <BiDotsHorizontalRounded size={50} /> : el}
            </PaginationItem>
          ))}
      </div>
    </div>
  );
};

export default Pagination;

//
