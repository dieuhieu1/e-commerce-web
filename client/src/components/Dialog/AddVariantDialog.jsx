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
import { UploadCloud, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { apiUploadImages, apiDeleteImage } from "@/apis/image";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import { formatCurrency, parseCurrency } from "@/ultils/helpers";
import { apiAddVariant } from "@/apis/product";

const AddVariantDialog = ({ originalVariant, open, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({
    message: "",
    onConfirm: null,
  });
  const [displayPrice, setDisplayPrice] = useState("");
  const [tempUploadedImages, setTempUploadedImages] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isDirty, isSubmitting, errors },
  } = useForm();
  // Assign data from parent component
  useEffect(() => {
    if (originalVariant && open) {
      reset({
        title: originalVariant.title || "",
        price: originalVariant.price || 0,
        color: originalVariant.color || "",
      });
      setDisplayPrice(formatCurrency(originalVariant.price || 0));
    }
  }, [originalVariant, open]);

  // Open Confirm Dialog
  const openConfirm = (message, onConfirm) => {
    setConfirmData({ message, onConfirm });
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmData({ message: "", onConfirm: null });
  };

  // Handle Upload Images
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
  // Delete image
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
        setTempUploadedImages((prev) =>
          prev.filter((id) => id !== image.public_id)
        );

        if (field === "thumb") {
          setThumbPreview(null);
          setValue("thumb", null);
        } else {
          const updated = imagePreviews.filter(
            (i) => i.public_id !== image.public_id
          );
          setImagePreviews(updated);
          setValue("images", updated);
        }

        toast.success("🗑️ Image deleted successfully!");
      }
    } catch {
      toast.error("❌ Failed to delete image!");
    } finally {
      setLoading(false);
      closeConfirm();
    }
  };

  // Submit variant
  const onSubmit = async (data) => {
    if (!thumbPreview) {
      toast.error("Thumbnail is required!");
      return;
    }

    const productId = originalVariant._id;
    const variantData = {
      title: data.title.trim(),
      color: data.color.trim(),
      price: parseCurrency(displayPrice),
      thumb: thumbPreview,
      images: imagePreviews,
    };

    try {
      setLoading(true);
      const res = await apiAddVariant(productId, variantData);

      if (res.success) {
        toast.success(res.message || "Variant added successfully!", {
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
        await cleanupAndClose(true);
        onSave(res.success);
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

  const handleClose = async () => {
    if (isDirty) {
      openConfirm("Discard unsaved changes?", async () => {
        await cleanupAndClose(false);
      });
      return;
    }
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
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-lg font-semibold">
            Add Product Variant
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-2" />
            <p className="text-gray-600 font-medium">Processing...</p>
          </div>
        )}

        <div className="overflow-y-auto p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Title */}
            <div className="flex flex-col gap-1">
              <Label>Title</Label>
              <Input
                {...register("title", { required: "Title is required" })}
              />
            </div>

            {/* Color */}
            <div className="flex flex-col gap-1">
              <Label>Color</Label>
              <Input
                {...register("color", { required: "Color is required" })}
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <Label>Price</Label>
              <Input
                type="text"
                value={displayPrice}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^\d]/g, "");
                  setDisplayPrice(formatCurrency(raw));
                  setValue("price", parseCurrency(raw));
                }}
                placeholder="Enter price"
              />
            </div>

            {/* Thumbnail */}
            <div className="flex flex-col gap-1">
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
                <div className="relative w-40 h-40 mt-3">
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
            <div className="flex flex-col gap-1">
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
                  <div key={idx} className="relative w-32 h-32">
                    <img
                      src={img.image_url}
                      alt={`preview-${idx}`}
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

            {/* Footer */}
            <DialogFooter className="flex justify-end mt-6">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="ml-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSubmitting ? "Saving..." : "Add Variant"}
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

export default AddVariantDialog;
