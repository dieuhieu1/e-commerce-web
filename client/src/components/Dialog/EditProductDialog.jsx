import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { apiUpdateProduct } from "@/apis/product";

const EditProductDialog = ({ product, open, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      brand: "",
      price: 0,
      quantity: 0,
      color: "",
    },
  });

  // Khi product thay đổi (hoặc mở dialog), reset lại form
  useEffect(() => {
    if (product) {
      reset({
        title: product.title || "",
        brand: product.brand || "",
        price: product.price || 0,
        quantity: product.quantity || 0,
        color: product.color || "",
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await apiUpdateProduct(product._id, data);
      if (res.success) {
        toast.success("✅ Product updated successfully!");
        onSave && onSave();
        onClose();
      } else {
        toast.error("❌ Failed to update product!");
      }
    } catch (error) {
      console.error(error);
      toast.error("⚠️ Something went wrong!");
    }
  };

  const handleClose = () => {
    if (isDirty && !confirm("⚠️ You have unsaved changes. Discard them?")) {
      return;
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid gap-3">
            <Label>Title</Label>
            <Input {...register("title", { required: "Title is required" })} />
          </div>

          <div className="grid gap-3">
            <Label>Brand</Label>
            <Input {...register("brand", { required: "Brand is required" })} />
          </div>

          <div className="grid gap-3">
            <Label>Price</Label>
            <Input
              type="number"
              {...register("price", { required: true, min: 0 })}
            />
          </div>

          <div className="grid gap-3">
            <Label>Quantity</Label>
            <Input
              type="number"
              {...register("quantity", { required: true, min: 0 })}
            />
          </div>

          <div className="grid gap-3">
            <Label>Color</Label>
            <Input {...register("color")} />
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
