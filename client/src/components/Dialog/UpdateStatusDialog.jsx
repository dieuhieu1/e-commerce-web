import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { apiUpdateOrderStatus } from "@/apis/order";
import { toast } from "react-hot-toast";

const UpdateStatusDialog = ({
  isStatusModalOpen,
  setIsStatusModalOpen,
  selectedOrder,
  getStatusIcon,
  onUpdateSuccess,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(
    selectedOrder?.status || "Pending"
  );
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Processing", label: "Processing" },
    { value: "Shipping", label: "Shipping" },
    { value: "Succeed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const handleSaveChanges = async () => {
    if (!selectedOrder) return;
    setLoading(true);

    try {
      const response = await apiUpdateOrderStatus(selectedOrder._id, {
        status: selectedStatus,
      });

      if (response.success) {
        toast.success("Order status updated successfully!");
        if (onUpdateSuccess) onUpdateSuccess();
        setIsStatusModalOpen(false);
      } else {
        toast.error("Failed to update order status.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating status." + error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedOrder) return null;

  return (
    <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Update Order Status
          </DialogTitle>
          <DialogDescription>
            Order ID:{" "}
            <span className="font-mono text-sm">{selectedOrder._id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={selectedStatus}
            onValueChange={setSelectedStatus}
            className="space-y-3"
          >
            {statusOptions.map((status) => (
              <div key={status.value} className="relative">
                <RadioGroupItem
                  value={status.value}
                  id={status.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={status.value}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedStatus === status.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {getStatusIcon(status.value)}
                  <span className="font-semibold flex-1">{status.label}</span>
                  {selectedStatus === status.value && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter className="flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsStatusModalOpen(false)}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveChanges}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusDialog;
