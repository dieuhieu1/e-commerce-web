import { apiResetPassword } from "@/apis/authApi";
import { useState } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { IoSendSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import InputField from "@/components/Input/InputField";
import Button from "@/components/Common/Button";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!newPassword) {
      Swal.fire("Warning", "Please enter your new password!", "warning");
      return;
    }

    const response = await apiResetPassword({ newPassword, resetToken });

    if (response.success) {
      Swal.fire(
        "Password Reset Successful!",
        "Your password has been successfully updated.",
        "success"
      ).then(() => {
        setNewPassword("");
        navigate("/login");
      });
    } else {
      Swal.fire(
        "Reset Failed!",
        response.error ||
          response.message ||
          "Something went wrong, please try again.",
        "error"
      );
    }
  };

  const handleBack = () => navigate("/login");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6 z-50">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-[420px] flex flex-col gap-6 animate-fade-in">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Reset Your Password 🔒
        </h2>
        <p className="text-gray-500 text-center text-sm">
          Enter your new password below to reset your account access.
        </p>

        <InputField
          label="New Password"
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full"
        />

        <div className="flex justify-between mt-4">
          <Button
            leftIcon={BiLeftArrowAlt}
            variant="outline"
            onClick={handleBack}
            className="w-[45%]"
          >
            Back
          </Button>
          <Button
            onClick={handleResetPassword}
            rightIcon={IoSendSharp}
            className="w-[45%] bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
