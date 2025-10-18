import { useLocation } from "react-router-dom";

/**
 * Tự động tạo breadcrumbs từ URL
 * Trả về mảng { label, path }
 */

/**
 * Tự động tạo breadcrumbs từ URL
 * Bỏ các segment là ID (toàn số hoặc hex)
 */
export const useBreadcrumbs = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const pathSegments = pathname.split("/").filter(Boolean);

  const crumbs = pathSegments.map((segment, index, arr) => {
    // Tạo path cho segment
    const path = "/" + pathSegments.slice(0, index + 1).join("/");

    // Decode tên (replace %20 hoặc - thành space)
    const label = decodeURIComponent(segment).replace(/-/g, " ");

    return { label, path };
  });

  return [{ label: "Home", path: "/" }, ...crumbs];
};
