// usePagination.js

import { generateRange } from "@/ultils/helpers";
import { useMemo } from "react";

// Export một hằng số để component có thể import và kiểm tra
export const DOTS = "...";

export const usePagination = (totalCount, currentPage, siblingCount = 1) => {
  const paginationRange = useMemo(() => {
    const pageSize = 10;
    const totalPageCount = Math.ceil(totalCount / pageSize);
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return generateRange(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = generateRange(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = generateRange(1, leftItemCount);
      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = generateRange(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalCount, siblingCount, currentPage]);

  return paginationRange;
};
