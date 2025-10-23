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

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setParams({ page });
  };

  const range = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);
    return `${start} - ${end}`;
  };

  return (
    <div className="w-full flex justify-between items-center py-4 px-2 border-t border-gray-100 bg-white rounded-b-xl">
      <span className="text-sm text-gray-500 italic">
        Showing <span className="font-semibold text-gray-700">{range()}</span>{" "}
        of <span className="font-semibold text-gray-700">{totalCount}</span>
      </span>
      <div>
        <Pagination>
          <PaginationContent className="flex gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

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
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ManagePagination;
