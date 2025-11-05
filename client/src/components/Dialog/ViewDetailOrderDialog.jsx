import React from "react";
import {
  formatCurrencyVND,
  formatDate,
  getStatusColor,
} from "@/ultils/helpers";
import { DollarSign, User, Phone, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const ViewDetailOrderDialog = ({
  isDetailModalOpen,
  setIsDetailModalOpen,
  selectedOrder,
  getStatusIcon,
  handleClickUpdateStatusBtn,
}) => {
  if (!selectedOrder) return null;

  return (
    <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">
            Order Details
          </DialogTitle>
          <DialogDescription>{selectedOrder._id}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] px-6">
          <div className="pb-6">
            {/* Status and Date */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status.charAt(0).toUpperCase() +
                    selectedOrder.status.slice(1)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={selectedOrder.orderedBy.avatar.image_url}
                    alt={selectedOrder.orderedBy.firsname}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">
                      {selectedOrder.orderedBy.firstname +
                        " " +
                        selectedOrder.orderedBy.lastname}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedOrder.orderedBy.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">
                      {selectedOrder.orderedBy.mobile}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Shipping Address</p>
                    <p className="font-semibold text-gray-900">
                      {selectedOrder.shippingAddress ||
                        selectedOrder.orderedBy.address[0]?.value ||
                        "No address provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Products</h3>
              <div className="space-y-3">
                {selectedOrder.products.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={product.thumb}
                      alt={product.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {product.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {product.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatCurrencyVND(product.price * product.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Payment Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrencyVND(selectedOrder.total * 0.9 * 25000)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {formatCurrencyVND(selectedOrder.total * 0.05 * 25000)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold">
                    {formatCurrencyVND(selectedOrder.total * 0.05 * 25000)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatCurrencyVND(selectedOrder.total * 25000)}</span>
                </div>
                <div className="flex items-center gap-2 pt-3">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600">
                    Payment Method:{" "}
                    <span className="font-semibold text-gray-900">
                      {selectedOrder.paymentMethod || "COD"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={() => {
                  handleClickUpdateStatusBtn(selectedOrder);
                  setIsDetailModalOpen(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Update Status
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailOrderDialog;
