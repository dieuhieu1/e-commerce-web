import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import default_avatar from "../../assets/default_3.png";
import { apiDeleteImage, apiUploadImages } from "@/apis/image";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import toast from "react-hot-toast";
import { apiUpdateProfileUser } from "@/apis/user";
import LoadingOverlay from "@/components/Loading/LoadingOverlay";

const Personal = () => {
  const { user, updateUser } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [userData, setUserData] = useState({});

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({
    message: "",
    onConfirm: null,
  });
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
  } = useForm();

  // Assign user data in first useEffect
  useEffect(() => {
    if (user) {
      console.log(user);

      setUserData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email,
        mobile: user.mobile,
        avatar: user.avatar || null,
        role: user.role || "",
        isBlocked: user.isBlocked || false,
        address: user.address || [],
      });
      setAddresses(user.address);
    }
  }, [user]);

  // Assign user data to the form
  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      reset(userData);
    }
  }, [userData, reset]);

  const handleUploadAndChangeAvatar = async (file) => {
    if (!file) return;

    // Lấy _id ảnh hiện tại (nếu có)
    const currentAvatarId = avatarPreview?._id || userData?.avatar?._id;

    // Nếu đã có avatar cũ => xác nhận thay thế
    if (currentAvatarId) {
      return openConfirm("Replace existing thumbnail?", async () => {
        try {
          await apiDeleteImage({ _id: currentAvatarId });
          setAvatarPreview(null);
          await uploadNewImages(file);
        } catch (error) {
          console.error("Error replacing avatar:", error);
        }
      });
    }

    // Nếu chưa có avatar => upload luôn
    try {
      await uploadNewImages(file);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };
  const uploadNewImages = async (file) => {
    const formData = new FormData();
    formData.append("fileImages", file);

    try {
      setLoading(true);
      const res = await apiUploadImages(formData);
      if (res.success) {
        const image = res.data;
        // Save Avatar Preview
        setAvatarPreview(image[0]);
        toast.success("✅ Avatar uploaded successfully!");
      }
    } catch (error) {
      toast.error("❌ Upload failed!" + error);
    } finally {
      setLoading(false);
    }
  };

  // Open / Close Confirm Dialog
  const openConfirm = (message, onConfirm) => {
    setConfirmData({ message, onConfirm });
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmData({ message: "", onConfirm: null });
  };

  // Submit form
  const onSubmit = async (data) => {
    const updatedData = {
      ...userData,
      firstname: data.firstname,
      lastname: data.lastname,
      mobile: data.mobile,
      avatar: avatarPreview || userData.avatar,
      address: addresses,
    };
    try {
      setLoading(true);
      const updateUserInfo = await apiUpdateProfileUser(updatedData);
      if (updateUserInfo.success) {
        await updateUser({ avatar: avatarPreview || userData.avatar });

        toast.success(
          updateUserInfo.message || "User Profile updated successfully!"
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred while updating!" + error);
    } finally {
      setAvatarPreview(null);
      setUserData(updatedData);
      setIsEditing(false);
      setLoading(false);
    }
  };

  // Cancel update user info
  const handleCancel = () => {
    if (isDirty) {
      return openConfirm("Discard unsaved changes?", async () => {
        await cleanupAndClose(false); // Cleanup
      });
    }
  };

  // Clean up function
  const cleanupAndClose = async () => {
    if (avatarPreview) {
      try {
        setLoading(true);
        // Api Delete Image
        const response = await apiDeleteImage({ _id: avatarPreview._id });
        if (response.success) {
          toast.success("🧹 Cleaned temp images! Discard change successfully");
        }
      } catch (error) {
        toast.error("⚠️ Failed to clean temp images!" + error);
      } finally {
        setLoading(false);
      }
    }
    reset();
    setAvatarPreview(null);
    setIsEditing(false);
    closeConfirm();
  };

  const addAddress = () => {
    setAddresses([...addresses, { id: Date.now(), value: "" }]);
  };

  const removeAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const updateAddress = (id, value) => {
    setAddresses(
      addresses.map((addr) => (addr.id === id ? { ...addr, value } : addr))
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        {loading && <LoadingOverlay />}

        <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h1 className="text-3xl font-semibold text-gray-800">
            Personal Information
          </h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </header>

        <div className="p-6">
          {/* Avatar Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {avatarPreview || userData?.avatar ? (
                  <img
                    src={
                      avatarPreview?.image_url || userData?.avatar?.image_url
                    }
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={default_avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleUploadAndChangeAvatar(e.target.files[0])
                    }
                  />
                </label>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("firstname", {
                  required: "First name is required",
                  minLength: { value: 2, message: "Minimum 2 characters" },
                })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                } ${errors.firstname ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.firstname && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.firstname.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("lastname", {
                  required: "Last name is required",
                  minLength: { value: 2, message: "Minimum 2 characters" },
                })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                } ${errors.lastname ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.lastname && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.lastname.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={userData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{9,11}$/,
                    message: "Mobile must be 9-11 digits",
                  },
                })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                } ${errors.mobile ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 capitalize">
                {userData.role}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Status
              </label>
              <div className="flex items-center h-10">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    !userData.isBlocked
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {!userData.isBlocked ? "Active" : "Blocked"}
                </span>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Addresses</h2>
              {isEditing && (
                <button
                  type="button"
                  onClick={addAddress}
                  className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus size={16} />
                  Add Address
                </button>
              )}
            </div>

            {addresses.length === 0 ? (
              <p className="text-gray-500 text-sm">No addresses added yet</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr, index) => (
                  <div key={addr.id} className="flex gap-2">
                    <input
                      type="text"
                      value={addr.value}
                      onChange={(e) => updateAddress(addr.id, e.target.value)}
                      disabled={!isEditing}
                      placeholder={`Address ${index + 1}`}
                      className={`flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !isEditing
                          ? "bg-gray-100 cursor-not-allowed"
                          : "bg-white"
                      } border-gray-300`}
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeAddress(addr.id)}
                        className="cursor-pointer px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="cursor-pointer px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
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

export default Personal;
