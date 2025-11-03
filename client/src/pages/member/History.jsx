import React, { useState, useEffect } from "react";

import { Package } from "lucide-react";
import toast from "react-hot-toast";

import { apiCancelOrder, apiGetMyOrders } from "@/apis/order";
import { getStatusConfig } from "@/ultils/helpers";

import LoadingOverlay from "@/components/Loading/LoadingOverlay";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import OrderStatistics from "@/components/Order/OrderStatistics";
import OrderFilters from "@/components/Order/OrderFilter";
import ProductItem from "@/components/Product/ProductItem";
import OrderCard from "@/components/Order/OrderCard";
import OrderTimeline from "@/components/Order/OrderTimeline";
import ManagePagination from "@/components/Pagination/MangePagination";

import { useSearchParams } from "react-router-dom";

const History = () => {
  const [params] = useSearchParams();

  const [ordersData, setOrdersData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [orderIdToCancel, setOrderIdToCancel] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [summary, setSummary] = useState({
    totalSpent: 0,
    totalOrders: 0,
    succeedOrdersCount: 0,
    orders: [],
  });
  const fetchMyOrder = async () => {
    try {
      const queries = Object.fromEntries(params.entries());

      const response = await apiGetMyOrders({
        ...queries,
        limit: 5,
      });
      console.log(response);
      setOrdersData(response || ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await apiGetMyOrders();

        setSummary({
          totalSpent:
            res.orders
              .reduce((sum, o) => sum + Number(o?.total || 0), 0)
              .toFixed(2) * 25000,
          totalOrders: res.totalCount,
          completedOrders: res.completedOrders,
          orders: res.orders,
        });
        // setOrdersData(res.orders);
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    fetchMyOrder();
  }, [params]);

  const handleClickConfirmCancel = (orderId) => {
    setOrderIdToCancel(orderId);
    setConfirmOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!orderIdToCancel) return;

    try {
      setLoading(true);
      const response = await apiCancelOrder(orderIdToCancel);

      if (response.success) {
        toast.success("Order cancelled successfully!");
        fetchMyOrder();
      } else {
        toast.error("Failed to cancel order: " + response.message);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setConfirmOpen(false);
      setOrderIdToCancel(null);
      setLoading(false);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <OrderStatistics summary={summary} />

        {/* Filters */}
        <OrderFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Orders List */}
        {ordersData?.orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ordersData?.orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const isExpanded = expandedOrder === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <OrderCard
                    key={order._id}
                    order={order}
                    isExpanded={expandedOrder === order._id}
                    onToggleExpand={toggleExpand}
                    onCancelOrder={() => handleClickConfirmCancel(order._id)}
                  />

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.products.map((item) => (
                          <ProductItem key={item._id} item={item} />
                        ))}
                      </div>
                      <OrderTimeline
                        order={order}
                        statusConfig={statusConfig}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={(isOpen) => {
            setConfirmOpen(isOpen);
            if (!isOpen) setOrderIdToCancel(null);
          }}
          title="Confirm Cancellation"
          description="Are you sure you want to cancel this order? This action cannot be undone."
          onConfirm={handleCancelOrder}
        />
        <div className="w-full flex justify-center py-6 px-5 bg-gray-50 rounded-b-2xl border-t border-gray-100">
          <ManagePagination totalCount={ordersData.totalCount} pageSize={5} />
        </div>
      </div>
    </div>
  );
};

export default History;
