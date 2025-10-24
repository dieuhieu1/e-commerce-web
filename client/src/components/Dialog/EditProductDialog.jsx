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
      setThumbPreview(product.thumb ? { url: product.thumb } : null);
      setImagePreviews(product.images?.map((url) => ({ url })) || []);
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

    if (field === "thumb" && thumbPreview) {
      return openConfirm("Replace existing thumbnail?", async () => {
        await apiDeleteImage(thumbPreview);
        setThumbPreview(null);
        await uploadNewImages(files, field);
      });
    }

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
          url: img.imageUrl,
          public_id: img.publicId,
        }));

        // Save Template Images Not Save
        setTempUploadedImages((prev) => [...prev, ...images.map((i) => i._id)]);

        if (field === "thumb") {
          setThumbPreview(images[0]);
          setValue("thumb", images[0]);
        } else {
          setImagePreviews((prev) => [...prev, ...images]);
          setValue("images", [...(watch("images") || []), ...images]);
        }

        toast.success("✅ Images uploaded successfully!");
      } else toast.error("❌ Upload failed!");
    } catch (error) {
      toast.error("❌ Upload failed!");
    } finally {
      setLoading(false);
      closeConfirm();
    }
  };

  // --- Xóa ảnh ---
  const handleAskDelete = (image, field) => {
    openConfirm("Delete this image?", async () => {
      await handleDeleteImage(image, field);
    });
  };

  const handleDeleteImage = async (image, field) => {
    if (!image) return;
    try {
      setLoading(true);
      console.log(image);

      const res = await apiDeleteImage(image);
      if (res.success) {
        // Nếu ảnh bị xóa là ảnh tạm thì loại khỏi danh sách
        setTempUploadedImages((prev) =>
          prev.filter((id) => id !== image.public_id)
        );

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
          toast.success("🗑️ Image deleted successfully!");
        }
      }
    } catch {
      toast.error("❌ Failed to delete image!");
    } finally {
      setLoading(false);
      closeConfirm();
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      _id: product._id,
      price: Number(data.price),
      thumb: thumbPreview?.url || product.thumb,
      images: imagePreviews.map((img) => img.url),
    };

    try {
      setLoading(true);
      const res = await apiUpdateProduct(payload);
      if (res.success) {
        toast.success("✅ Product updated successfully!");
        onSave && onSave(payload);
        setTempUploadedImages([]);
        onClose();
      } else toast.error("❌ Failed to update product!");
    } catch (error) {
      toast.error("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // --- Cancel / Đóng dialog ---
  const handleClose = async () => {
    if (isDirty && !confirm("Discard unsaved changes?")) return;

    if (tempUploadedImages.length > 0) {
      try {
        console.log(tempUploadedImages);

        setLoading(true);
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
    }
    reset();
    setThumbPreview(null);
    setImagePreviews([]);
    setDisplayPrice("");
    setConfirmOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">
            Edit Product
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
                render={({ field }) => (
                  <MarkdownEditor
                    label="Description"
                    name={field.name}
                    value={field.value}
                    setValue={setValue}
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
                    src={thumbPreview.url}
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
                      src={img.url}
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
