import { useDebounce } from "@/hooks/useDebounce";
import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const OrderFilters = () => {
  const [params, setParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    params.get("status") || "all"
  );

  const debouncedSearch = useDebounce(searchQuery, 800);

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value === "all") newParams.delete("status");
      else newParams.set("status", value);
      newParams.delete("orderId");

      newParams.set("page", 1);
      return newParams;
    });
    setStatusFilter(value);
  };
  useEffect(() => {
    const newParams = new URLSearchParams(params);
    if (debouncedSearch) {
      newParams.set("search", debouncedSearch);
      newParams.delete("orderId");
    } else {
      newParams.delete("search");
    }

    newParams.set("page", 1);

    if (newParams.toString() !== params.toString()) {
      setParams(newParams);
    }
  }, [debouncedSearch, params, setParams]);
  // const handleSearchChange = (value) => {
  //   setParams((prev) => {
  //     const newParams = new URLSearchParams(prev);
  //     if (value.trim()) newParams.set("q", value);
  //     else newParams.delete("q");
  //     newParams.set("page", 1);
  //     return newParams;
  //   });
  //   setSearchQuery(value);
  // };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ô tìm kiếm */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by order ID or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Bộ lọc trạng thái */}
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Succeed">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
