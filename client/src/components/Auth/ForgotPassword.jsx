import React from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { IoSendSharp } from "react-icons/io5";
import InputField from "../Input/InputField";
import Button from "../Common/Button";

const ForgotPassword = ({
  invalidField,
  setInvalidField,
  email,
  setEmail,
  handleBack,
  handleForgotPassword,
  animation,
}) => {
  return (
    <div
      className={`absolute top-0 left-0 bottom-0 right-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 z-50 ${animation}`}
    >
      <div className="w-full max-w-2/6 px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Forgot Password?
          </h2>
          <p className="text-gray-600 text-sm">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <InputField
            invalidField={invalidField}
            setInvalidField={setInvalidField}
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@example.com"
            className="w-full"
          />

          <div className="flex items-center justify-between gap-3 mt-6">
            <Button
              className="cursor-pointer flex-1 hover:bg-gray-50 transition-colors"
              leftIcon={BiLeftArrowAlt}
              variant="outline"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              onClick={handleForgotPassword}
              className="cursor-pointer flex-1 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              rightIcon={IoSendSharp}
              fullWidth
            >
              Send Reset Link
            </Button>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            Back to login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
