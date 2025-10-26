import { useBreadcrumbs } from "@/hooks/useBreadCumbs";
import { Link } from "react-router-dom";

const Breadcrumbs = () => {
  const crumbs = useBreadcrumbs();
  const validCrumbs = crumbs.filter((segment) => {
    // Bỏ segment là ID: toàn số hoặc hex (32 ký tự)
    const isHexId = /^[0-9a-fA-F]{8,32}$/.test(segment.label);
    return !isHexId;
  });
  console.log(crumbs);

  return (
    <nav className="text-md text-gray-600 ">
      {validCrumbs.map((c, i) => (
        <span key={c.path}>
          <Link
            to={c.path}
            className="capitalize gap-1 items-center hover:text-main"
          >
            {c.label}
          </Link>
          {i < crumbs.length - 1 && " / "}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
