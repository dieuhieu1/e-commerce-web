import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "react-router-dom";
import { usePagination, DOTS } from "@/hooks/usePagination";

const ManagePagination = ({ totalCount, pageSize }) => {
  const [params, setParams] = useSearchParams();
  const currentPage = +params.get("page") || 1;
  const paginationRange = usePagination(totalCount, currentPage, pageSize);
  const totalPages = Math.ceil(totalCount / pageSize);
  console.log(totalCount, pageSize);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", page);
      return newParams;
    });
  };

  const range = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);
    return `${start} - ${end}`;
  };
  if (totalCount === 0) return null;
  return (
    <div className="w-full flex justify-between items-center py-4 px-2 border-t border-gray-100 bg-white rounded-b-xl">
      <span className="text-sm text-gray-500 italic">
        Showing <span className="font-semibold text-gray-700">{range()}</span>{" "}
        of <span className="font-semibold text-gray-700">{totalCount}</span>
      </span>

      <div>
        <Pagination>
          <PaginationContent className="flex gap-1">
            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={`cursor-pointer ${
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }`}
              />
            </PaginationItem>

            {/* Pages */}
            {paginationRange?.map((page, idx) => {
              if (page === DOTS)
                return (
                  <PaginationItem key={idx}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );

              return (
                <PaginationItem key={idx}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                    className="cursor-pointer hover:bg-gray-100 transition-colors rounded-md "
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={`cursor-pointer ${
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ManagePagination;
