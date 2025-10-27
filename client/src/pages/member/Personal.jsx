import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/lib/zustand/useAuthStore";

const Personal = () => {
  const { user } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [userData, setUserData] = useState({});

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
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
      });
    }
  }, [user]);
  // Assign user data to the form
  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      reset(userData);
    }
  }, [userData, reset]);

  const newPassword = watch("newPassword");

  const onSubmit = (data) => {
    const updatedData = {
      ...userData,
      firstname: data.firstname,
      lastname: data.lastname,
      mobile: data.mobile,
      avatar: avatarPreview || userData.avatar,
    };

    if (data.newPassword && data.newPassword === data.confirmPassword) {
      updatedData.password = data.newPassword;
    }

    setUserData(updatedData);
    setIsEditing(false);
    console.log("Updated data:", { ...updatedData, addresses });
  };

  const handleCancel = () => {
    reset(userData);
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
                {avatarPreview || userData.avatar ? (
                  <img
                    src={avatarPreview || userData.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-400">
                    {userData.firstname}
                    {userData.lastname}
                  </span>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
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
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
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
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Personal;
