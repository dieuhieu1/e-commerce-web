import React, { useEffect, useState } from "react";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  apiGetProducts,
  apiDeleteProduct,
  apiUpdateProduct,
} from "@/apis/product";
import { useDebounce } from "@/hooks/useDebounce";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star } from "lucide-react";
import Button from "@/components/Common/Button";
import InputField from "@/components/Input/InputField";
import Pagination from "@/components/Pagination/Pagination";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import EditProductDialog from "@/components/Dialog/EditProductDialog";

const ManageProduct = () => {
  // Hook
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  // State
  const [data, setData] = useState([]);
  const [queries, setQueries] = useState({ q: "" });
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Debounce
  const queriesDebounce = useDebounce(queries.q, 800);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    try {
      const res = await apiGetProducts({ ...params, limit: 10 });
      setData(res || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queriesDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ q: queriesDebounce }).toString(),
      });
    } else {
      navigate({ pathname: location.pathname });
    }
  }, [queriesDebounce]);
  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchProducts(searchParams);
  }, [params]);
  const handleSave = async (updatedData) => {
    const { _id: productId, ...data } = updatedData;
    const res = await apiUpdateProduct(productId, data);
    if (res.success) {
      toast.success(res.message || "Product updated successfully!", {
        duration: 3500,
        icon: "💾",
        style: {
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          color: "#166534",
          border: "1px solid #86efac",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          padding: "12px 18px",
          borderRadius: "10px",
          fontWeight: "500",
          fontSize: "15px",
        },
      });
      fetchProducts(Object.fromEntries([...params]));
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleDeleteClick = (productId) => {
    setSelectedProduct(productId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    if (!selectedProduct) return;

    try {
      const deleted = await apiDeleteProduct(selectedProduct);
      if (deleted.success) {
        toast.success(deleted.message, {
          icon: "🗑️",
          style: {
            background: "#f0fdf4",
            color: "#166534",
            border: "1px solid #bbf7d0",
            fontWeight: "500",
          },
          duration: 3000,
        });
        fetchProducts(Object.fromEntries([...params]));
      } else {
        toast.error(deleted.message || "Failed to delete product", {
          style: { background: "#fef2f2", color: "#991b1b" },
        });
      }
    } catch (error) {
      toast.error("An error occurred while deleting product: " + error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-8">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow-md flex justify-between items-center text-2xl font-semibold px-6 py-4 rounded-xl border border-gray-200">
        <span className="text-gray-800">🛒 Manage Products</span>
        <Button
          onClick={() => fetchProducts()}
          variant="outline"
          className="flex items-center gap-2 font-medium hover:bg-gray-100 transition-all duration-200"
          width="w-[150px]"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          Refresh
        </Button>
      </header>

      {/* Search bar */}
      <div className="flex justify-end mt-6 mb-4">
        <InputField
          name="q"
          value={queries.q}
          setValue={setQueries}
          label="Search by product name"
          width="w-[350px]"
          className="shadow-sm"
        />
      </div>

      {/* Table container */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">#</th>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Brand</th>
              <th className="px-6 py-4 text-left">Color</th>
              <th className="px-6 py-4 text-center">Price</th>
              <th className="px-6 py-4 text-center">Rating</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.products?.length > 0 ? (
              data.products.map((product, index) => (
                <tr
                  key={product._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b border-gray-100 hover:bg-blue-50 transition-all duration-200`}
                >
                  <td className="px-6 py-4 font-medium text-gray-600">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={product.thumb}
                      alt={product.title}
                      className="w-12 h-12 rounded-md object-cover border"
                    />
                    <p className="font-semibold text-gray-800 line-clamp-1">
                      {product.title}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 capitalize">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-gray-600 capitalize">
                    {product.brand}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      {product.color && (
                        <span
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: product.color }}
                        ></span>
                      )}
                      <span className="capitalize">{product.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700 font-medium">
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-1">
                      <Star
                        size={16}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      <span className="font-medium text-gray-700">
                        {product.totalRatings
                          ? product.totalRatings.toFixed(1)
                          : "0.0"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.quantity > 0 ? (
                      <Badge className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        {product.quantity}
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-600 px-3 py-1 rounded-full">
                        Out of stock
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.isBlocked ? (
                      <Badge className="bg-red-100 text-red-600 rounded-full px-3 py-1">
                        Hidden
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 rounded-full px-3 py-1">
                        Active
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-400 text-blue-600 hover:bg-blue-50"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      className="hover:bg-red-600 transition-all"
                      onClick={() => handleDeleteClick(product._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="text-center py-8 text-gray-500 font-medium"
                >
                  {loading ? "Loading products..." : "No products found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="w-full flex justify-center py-6 px-5 bg-gray-50 rounded-b-2xl border-t border-gray-100">
          <Pagination totalCount={data.totalCount} pageSize={10} />
        </div>

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete product?"
          description="This action cannot be undone. The product will be permanently removed."
          onConfirm={handleConfirmDelete}
        />

        {/* Edit Dialog */}
        <EditProductDialog
          product={selectedProduct}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default ManageProduct;
