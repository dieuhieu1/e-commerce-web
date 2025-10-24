import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud, Loader2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiUploadImages, apiDeleteImage } from "@/apis/image";
import { useProductStore } from "@/lib/zustand/useProductStore";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import MarkdownEditor from "@/components/Input/MarkdownEditor";
import { apiCreateProduct } from "@/apis/product";
import { formatCurrency, formatMoney, parseCurrency } from "@/ultils/helpers";

const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const { productCategories } = useProductStore();
  const [thumbPreview, setThumbPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⚙️ State cho Confirm Dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({
    action: null,
    message: "",
    onConfirm: null,
  });
  const [displayPrice, setDisplayPrice] = useState("");
  // 🔄 Mở dialog xác nhận
  const openConfirm = (message, onConfirm) => {
    setConfirmData({ message, onConfirm });
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmData({ action: null, message: "", onConfirm: null });
  };

  // 📤 Upload ảnh lên Cloudinary
  const handleUploadImages = async (files, field) => {
    if (!files || files.length === 0) return;

    // 🧩 Nếu upload thumbnail mới mà có sẵn ảnh → hỏi người dùng
    if (field === "thumb" && thumbPreview) {
      return openConfirm("Replace existing thumbnail?", async () => {
        await apiDeleteImage(thumbPreview);
        setThumbPreview(null);
        setValue("thumb", null);
        await uploadNewImages(files, field);
      });
    }

    // 🧩 Nếu upload gallery mới mà có sẵn ảnh → hỏi người dùng
    if (field === "images" && imagePreviews.length > 0) {
      return openConfirm("Replace existing gallery images?", async () => {
        for (const img of imagePreviews) await apiDeleteImage(img);
        setImagePreviews([]);
        setValue("images", []);
        await uploadNewImages(files, field);
      });
    }

    // ✅ Nếu chưa có ảnh thì upload luôn
    uploadNewImages(files, field);
  };

  // 📤 Hàm upload chính
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
      console.error(error);
      toast.error("❌ Upload failed!");
    } finally {
      setLoading(false);
      closeConfirm();
    }
  };

  // 🗑️ Hỏi trước khi xóa
  const handleAskDelete = (image, field) => {
    openConfirm("Delete this image permanently?", async () => {
      await handleDeleteImage(image, field);
    });
  };

  // 🧹 Xóa ảnh thật sự
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
        toast.success("🗑️ Image deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete image!");
    } finally {
      setLoading(false);
      closeConfirm();
    }
  };

  // ✅ Submit form
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        title: data.title?.trim(),
        brand: data.brand?.trim(),
        description: data.description,
        category: data.category,
        price: Number(data.price),
        quantity: Number(data.quantity),
        color: data.color?.trim() || null,
        thumb: data.thumb ? data.thumb.url : null,
        images: data.images?.map((img) => img.url) || [],
      };

      const res = await apiCreateProduct(payload);

      if (res.success) {
        toast.success("🎉 Product created successfully!");
        reset();
        setThumbPreview(null);
        setImagePreviews([]);
        setDisplayPrice("");
      } else {
        toast.error(res.message || "❌ Failed to create product");
      }
    } catch (error) {
      console.error("❌ Create product error:", error);
      toast.error(error.response?.data?.message || "Server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* 🔄 Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-2" />
          <p className="text-gray-600 font-medium">Processing...</p>
        </div>
      )}

      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        Create New Product
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 grid grid-cols-2 gap-6"
      >
        {/* Title */}
        <div className="flex flex-col space-y-2">
          <Label>Title</Label>
          <Input
            placeholder="Enter product title"
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
            placeholder="Enter brand name"
            {...register("brand", { required: "Brand is required" })}
          />
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
                setValue={setValue}
                error={errors.description?.message}
              />
            )}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col space-y-2">
          <Label>Category</Label>
          <Controller
            name="category"
            control={control}
            defaultValue=""
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories?.map((el, index) => (
                    <SelectItem value={el.title} key={`${el._id}--${index}`}>
                      {el.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Price */}
        <div className="flex flex-col space-y-2">
          <Label>Price</Label>
          <Input
            type="text"
            placeholder="Enter price (e.g. 8.000.000)"
            value={displayPrice}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/[^\d]/g, "");
              setDisplayPrice(formatCurrency(rawValue));
              setValue("price", Number(parseCurrency(rawValue)));
            }}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* Quantity */}
        <div className="flex flex-col space-y-2">
          <Label>Quantity</Label>
          <Input
            type="number"
            placeholder="Enter quantity"
            {...register("quantity")}
          />
        </div>

        {/* Color */}
        <div className="flex flex-col space-y-2">
          <Label>Color</Label>
          <Input placeholder="Enter color" {...register("color")} />
        </div>

        {/* Thumbnail Upload */}
        <div className="col-span-2 flex flex-col space-y-2">
          <Label>Thumbnail</Label>
          <label
            htmlFor="thumbUpload"
            className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
            <p className="text-sm font-medium text-gray-500">
              Click or drag file to upload
            </p>
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
                className="w-full h-full object-cover rounded-md border shadow"
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

        {/* Gallery Upload */}
        <div className="col-span-2 flex flex-col space-y-2">
          <Label>Gallery Images</Label>
          <label
            htmlFor="galleryUpload"
            className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
            <p className="text-sm font-medium text-gray-500">
              Click or drag files to upload
            </p>
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
              <div key={idx} className="relative w-48 h-48">
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

        <div className="col-span-2 flex justify-end mt-6">
          <Button type="submit" className="px-6">
            Create Product
          </Button>
        </div>
      </form>

      {/* ⚡ Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm Action"
        description={confirmData.message}
        onConfirm={confirmData.onConfirm}
      />
    </div>
  );
};

export default CreateProduct;
