import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { apiChangePassword } from "@/apis/authApi";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setError,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const response = await apiChangePassword(data);
      if (response.success) {
        toast.success(response.message);
        setSuccessMessage(response.message);

        // Reset Form
        reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(response.message);
        setError("currentPassword", {
          type: "manual",
          message: "Current password is incorrect",
        });
      }
    } catch (error) {
      setErrorMessage("Failed to change password. Please try again." + error);
    }
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2)
      return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (strength <= 4)
      return { strength: 2, label: "Medium", color: "bg-yellow-500" };
    return { strength: 3, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Lock size={32} />
              <h1 className="text-3xl font-bold">Change Password</h1>
            </div>
            <p className="text-blue-100">
              Keep your account secure by updating your password regularly
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <p className="text-green-800 font-medium">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("currentPassword", {
                      required: "Current password is required",
                    })}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.currentPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="border-t-2 border-gray-200 my-6"></div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message:
                          "Password must contain uppercase, lowercase, and number",
                      },
                    })}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.newPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.newPassword.message}
                  </p>
                )}

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Password Strength:
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          passwordStrength.strength === 1
                            ? "text-red-600"
                            : passwordStrength.strength === 2
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{
                          width: `${(passwordStrength.strength / 3) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Password must contain:
                  </p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li className="flex items-center gap-2">
                      <span
                        className={
                          newPassword?.length >= 8
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      >
                        {newPassword?.length >= 8 ? "✓" : "○"}
                      </span>
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <span
                        className={
                          /[A-Z]/.test(newPassword)
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      >
                        {/[A-Z]/.test(newPassword) ? "✓" : "○"}
                      </span>
                      One uppercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <span
                        className={
                          /[a-z]/.test(newPassword)
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      >
                        {/[a-z]/.test(newPassword) ? "✓" : "○"}
                      </span>
                      One lowercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <span
                        className={
                          /[0-9]/.test(newPassword)
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      >
                        {/[0-9]/.test(newPassword) ? "✓" : "○"}
                      </span>
                      One number
                    </li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === newPassword || "Passwords do not match",
                    })}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.confirmPassword.message}
                  </p>
                )}
                {!errors.confirmPassword &&
                  newPassword &&
                  watch("confirmPassword") === newPassword &&
                  watch("confirmPassword") && (
                    <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle size={16} /> Passwords match
                    </p>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-blue-50 px-6 py-4 border-t border-blue-100">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Security Tips:
            </h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Never share your password with anyone</li>
              <li>• Use a unique password for each account</li>
              <li>• Change your password regularly (every 3-6 months)</li>
              <li>• Avoid using personal information in passwords</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
