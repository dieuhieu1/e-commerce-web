import React, { useEffect, useState } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiUploadImages, apiDeleteImage } from "@/apis/image";
import { apiUpdateProduct } from "@/apis/product";
import MarkdownEditor from "@/components/Input/MarkdownEditor";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useProductStore } from "@/lib/zustand/useProductStore";
import { formatCurrency, parseCurrency } from "@/ultils/helpers";

const EditProductDialog = ({ product, open, onClose, onSave }) => {
  const { productCategories } = useProductStore();
  const [loading, setLoading] = useState(false);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({
    message: "",
    onConfirm: null,
  });
  const [displayPrice, setDisplayPrice] = useState("");
  const [tempUploadedImages, setTempUploadedImages] = useState([]); // 🆕 ảnh tạm

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { isDirty, isSubmitting, errors },
  } = useForm();

  // --- Load dữ liệu sản phẩm khi mở ---
  useEffect(() => {
    console.log(product);

    if (product) {
      reset({
        title: product.title || "",
        brand: product.brand || "",
        category: product.category || "",
        price: product.price || 0,
        quantity: product.quantity || 0,
        color: product.color || "",
        description: Array.isArray(product.description)
          ? product.description.join("")
          : product.description || "",
      });
      setDisplayPrice(formatCurrency(product.price || 0));
      setThumbPreview(product.thumb ? product.thumb : null);
      setImagePreviews(product.images?.map((image) => image) || []);
      setLoading(false);
    }
  }, [product, reset, open]);

  // --- Mở Confirm Dialog ---
  const openConfirm = (message, onConfirm) => {
    setConfirmData({ message, onConfirm });
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmData({ message: "", onConfirm: null });
  };

  // --- Upload ảnh ---
  const handleUploadImages = async (files, field) => {
    if (!files || files.length === 0) return;
    // If existed a thumb, replace the one old
    if (field === "thumb" && thumbPreview) {
      return openConfirm("Replace existing thumbnail?", async () => {
        await apiDeleteImage({ _id: thumbPreview._id });
        setThumbPreview(null);
        // Upload new image
        await uploadNewImages(files, field);
      });
    }
    // If field = galery --> Just upload
    await uploadNewImages(files, field);
  };

  const uploadNewImages = async (files, field) => {
    const formData = new FormData();
    for (let file of files) formData.append("fileImages", file);

    try {
      setLoading(true);
      const res = await apiUploadImages(formData);
      if (res.success) {
        const images = res.data.map((img) => ({
          _id: img._id,
          image_url: img.image_url,
          public_id: img.publicId,
        }));

        // Save Template Images Not Save
        setTempUploadedImages((prev) => [...prev, ...images.map((i) => i._id)]);

        if (field === "thumb") {
          setThumbPreview(images[0]);
          setValue("thumb", images[0]);
        } else {
          setImagePreviews((prev) => [...prev, ...images]);
          setValue("images", [...watch("images"), ...images]);
        }

        toast.success("✅ Images uploaded successfully!");
      }
    } catch (error) {
      toast.error("❌ Upload failed!");
    } finally {
      setLoading(false);
      closeConfirm();
    }
  };

  // Confirm Delete Image
  const handleAskDelete = (image, field) => {
    openConfirm("Delete this image?", async () => {
      await handleDeleteImage(image, field);
    });
  };

  // Handle Delete Image
  const handleDeleteImage = async (image, field) => {
    if (!image) return;
    try {
      setLoading(true);

      const res = await apiDeleteImage(image);
      if (res.success) {
        if (field === "thumb") {
          setThumbPreview(null);
          setValue("thumb", null);
        } else {
          const updated = imagePreviews.filter(
            (img) => img.public_id !== image.public_id
          );
          setImagePreviews(updated);
          setValue("images", updated);
        }

        // Check if the Image is temp, delete it from state TempUploadedImage
        setTempUploadedImages((prev) =>
          prev.filter((id) => id !== image.public_id)
        );

        toast.success("🗑️ Image deleted successfully!");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("❌ Failed to delete image!");
    } finally {
      setLoading(false);
      closeConfirm();
    }
  };

  const onSubmit = async (data) => {
    if (!thumbPreview || !imagePreviews) {
      toast.error("Thumbnail and Image Gallery is required!");
      return;
    }

    const productId = product._id;
    const productData = {
      price: Number(data.price),
      thumb: thumbPreview,
      images: imagePreviews,
      ...data,
    };

    console.log(productData);
    try {
      setLoading(true);
      // Call api update product
      const res = await apiUpdateProduct(productId, productData);

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
        // Set the temp image to [] prevent no to delete in cleanup function
        setTempUploadedImages([]);
        await cleanupAndClose(true);
        // Pass the result to reload data in Parent Component
        onSave(res.success);

        // Clean up function
      } else {
        toast.error(res.message || "Failed to add variant!");
      }
    } catch (error) {
      console.error("⚠️ Error adding variant:", error);
      toast.error("An unexpected error occurred while saving!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Close (cancel)
  const handleClose = async () => {
    if (isDirty) {
      // show confirm dialog and if confirmed -> cleanupAndClose()
      openConfirm("Discard unsaved changes?", async () => {
        await cleanupAndClose(false); // default - xoá temp images
      });
      return;
    }
    // not dirty -> safe to cleanup and close (delete temps)
    await cleanupAndClose(false);
  };

  // Clean up state and image function
  const cleanupAndClose = async (keepTemps = false) => {
    if (!keepTemps && tempUploadedImages.length > 0) {
      try {
        setLoading(true);
        // apiDeleteImage expects { _id } or public_id based on your api
        await Promise.all(
          tempUploadedImages.map((_id) => apiDeleteImage({ _id }))
        );
        console.log("🧹 Cleaned temp images:", tempUploadedImages);
      } catch (error) {
        console.error("⚠️ Failed to clean temp images:", error);
      } finally {
        setLoading(false);
        setTempUploadedImages([]);
      }
    } else {
      // if keepTemps === true we clear temp array so cleanup won't attempt deleting later
      setTempUploadedImages([]);
    }

    // Reset local form/UI state before closing
    try {
      reset();
    } catch (e) {
      // safe-guard: reset might fail if form unmounted
      console.warn("reset() failed:", e);
    }
    setThumbPreview(null);
    setImagePreviews([]);
    setDisplayPrice("");
    setConfirmOpen(false);
    onClose && onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">
            Edit Product
          </DialogTitle>
        </DialogHeader>
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-2" />
            <p className="text-gray-600 font-medium">Processing...</p>
          </div>
        )}
        <div className="overflow-y-auto p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-6 py-2"
          >
            {/* Title */}
            <div className="flex flex-col space-y-2">
              <Label>Title</Label>
              <Input
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Brand */}
            <div className="flex flex-col space-y-2">
              <Label>Brand</Label>
              <Input
                {...register("brand", { required: "Brand is required" })}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col space-y-2">
              <Label>Category</Label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories?.map((cat) => (
                        <SelectItem key={cat._id} value={cat.title}>
                          {cat.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Color */}
            <div className="flex flex-col space-y-2">
              <Label>Color</Label>
              <Input {...register("color")} placeholder="Enter color" />
            </div>

            {/* Price */}
            <div className="flex flex-col space-y-2">
              <Label>Price</Label>
              <Input
                type="text"
                value={displayPrice}
                onChange={(e) => {
                  const raw = e?.target?.value.replace(/[^\d]/g, "");
                  setDisplayPrice(formatCurrency(raw));
                  setValue("price", parseCurrency(raw));
                }}
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col space-y-2">
              <Label>Quantity</Label>
              <Input type="number" {...register("quantity", { min: 0 })} />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <MarkdownEditor
                    label="Description"
                    name={field.name}
                    value={field.value || ""}
                    onChange={field.onChange} // ✅ dùng field.onChange
                    error={errors.description?.message}
                  />
                )}
              />
            </div>

            {/* Thumbnail */}
            <div className="col-span-2 flex flex-col space-y-2">
              <Label>Thumbnail</Label>
              <label
                htmlFor="thumbUpload"
                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
              >
                <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                <p className="text-sm text-gray-500">Click or drag to upload</p>
              </label>
              <input
                id="thumbUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUploadImages(e.target.files, "thumb")}
              />
              {thumbPreview && (
                <div className="relative w-48 h-48 mx-auto mt-3">
                  <img
                    src={thumbPreview.image_url}
                    alt="thumb"
                    className="w-full h-full object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => handleAskDelete(thumbPreview, "thumb")}
                    className="absolute top-1 right-1 bg-white/80 hover:bg-red-500 hover:text-white p-1 rounded-full shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Gallery */}
            <div className="col-span-2 flex flex-col space-y-2">
              <Label>Gallery Images</Label>
              <label
                htmlFor="galleryUpload"
                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
              >
                <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                <p className="text-sm text-gray-500">Click or drag to upload</p>
              </label>
              <input
                id="galleryUpload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUploadImages(e.target.files, "images")}
              />

              <div className="flex flex-wrap gap-3 mt-3">
                {imagePreviews.map((img, idx) => (
                  <div key={idx} className="relative w-40 h-40">
                    <img
                      src={img.image_url}
                      alt={`preview-${img._id}`}
                      className="w-full h-full object-cover rounded-md border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleAskDelete(img, "images")}
                      className="absolute top-1 right-1 bg-white/80 hover:bg-red-500 hover:text-white p-1 rounded-full shadow"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/*  Footer */}
            <DialogFooter className="col-span-2 flex justify-end mt-6">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="ml-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </div>

        {/* Confirm Dialog */}
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Confirm Action"
          description={confirmData.message}
          onConfirm={confirmData.onConfirm}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
