import React, { useCallback, useRef, useState, useEffect } from "react";
import image from "../../assets/bg-login.jpg";
import Swal from "sweetalert2"; // For custom alerts
import { useNavigate, useSearchParams } from "react-router-dom";
import path from "@/ultils/path";
import { useAuthStore } from "@/lib/zustand/useAuthStore"; // Zustand store for auth state (isLoading) and actions (login, register)
import { apiForgotPassword } from "@/apis/authApi";
import { validate } from "@/ultils/helpers"; // Validation helper

import Header from "@/components/Header/Header";
import Register from "@/components/Auth/Register";
import Login from "@/components/Auth/Login";
import ForgotPassword from "@/components/Auth/ForgotPassword";
import LoadingOverlay from "@/components/Common/Loading";

const LoginPage = () => {
  // Get state and actions from the Zustand auth store
  const { login, register, isLoading } = useAuthStore();

  // State for the 'Forgot Password' email input
  const [email, setEmail] = useState("");
  // State to hold validation error fields
  const [invalidField, setInvalidField] = useState([]);

  // React Router hook to read URL query parameters
  const [searchParams] = useSearchParams();

  // Ref to store the timeout ID for animations
  const timeoutRef = useRef(null);

  // State to manage the UI view (Login, Register, or Forgot Password) and animations
  const [uiState, setUiState] = useState({
    isRegister: false, // Are we showing the Register form?
    isForgotPassword: false, // Are we showing the Forgot Password form?
    animation: "animate-slide-in", // CSS animation class
  });

  // State to store the form data (email, password, etc.)
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    mobile: "",
  });

  const navigate = useNavigate();

  // Helper function to clear the form payload
  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      mobile: "",
    });
  };

  // --- FORM SUBMISSION ---
  // useCallback prevents this function from being recreated on every render,
  // optimizing child components (Login, Register) that receive it as a prop.
  const handleSubmit = useCallback(async () => {
    // Determine which fields to validate based on the current UI state
    const invalids = uiState.isRegister
      ? validate(payload, setInvalidField) // Validate all fields for register
      : validate(
          { email: payload.email, password: payload.password }, // Validate only email/password for login
          setInvalidField
        );

    // If validation passes (invalids === 0)
    if (invalids === 0) {
      if (uiState.isRegister) {
        // --- REGISTER LOGIC ---
        const response = await register(payload);
        if (response.success) {
          Swal.fire(
            "You created your account successfully! But you need to verify your email before login. Go to your email to verify now!",
            response.mes,
            "success"
          ).then(() => {
            setUiState((prev) => ({ ...prev, isRegister: false })); // Switch back to login view
            resetPayload();
          });
        } else {
          Swal.fire(
            "Oops something went wrong! Cannot Register, please try again!",
            response.message,
            "error"
          );
        }
      } else {
        // --- LOGIN LOGIC ---
        const { email, password } = payload;
        const response = await login({ email, password });

        if (response.success) {
          Swal.fire({
            title: "Login Successful!",
            text: "Welcome back!",
            icon: "success",
            timer: 1500, // Auto-close after 1.5s
            showConfirmButton: false,
          }).then(() => {
            // Navigate to home page or redirect URL
            searchParams.get("redirect")
              ? navigate(searchParams.get("redirect"))
              : navigate(`/${path.HOME}`);
          });
        } else {
          Swal.fire(
            "Oops something went wrong! Cannot login your account, please try again!",
            response.message,
            "error"
          );
        }
      }
    }
  }, [uiState.isRegister, payload, register, login, navigate]); // Dependencies for useCallback

  // --- FORGOT PASSWORD SUBMISSION ---
  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    console.log(response);

    if (response.success) {
      Swal.fire(
        "We have sent a password reset link to your email. Please check your inbox.",
        response.mes,
        "success"
      ).then(() => {
        setEmail(""); // Clear the email input
      });
    } else {
      Swal.fire(
        "Oops something went wrong! Cannot process your request, please try again!",
        response.error || response.message,
        "error"
      );
    }
  };

  // --- FORGOT PASSWORD BACK BUTTON ---
  // Handles the slide-out animation
  const handleBack = () => {
    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Set the animation to "slide-out"
    setUiState((prev) => ({ ...prev, animation: "animate-slide-out" }));

    // After the animation duration (400ms), *then* change the UI state
    timeoutRef.current = setTimeout(() => {
      setUiState((prev) => ({ ...prev, isForgotPassword: false }));
    }, 400);
  };

  return (
    <div className="w-screen h-screen flex flex-col relative ">
      {/* Show loading overlay if isLoading is true (from Zustand store) */}
      {isLoading && <LoadingOverlay />}
      <Header />

      {/* Conditionally render the ForgotPassword component */}
      {uiState.isForgotPassword && (
        <ForgotPassword
          handleBack={handleBack}
          animation={uiState.animation}
          invalidField={invalidField}
          setInvalidField={setInvalidField}
          email={email}
          setEmail={setEmail}
          handleForgotPassword={handleForgotPassword}
        />
      )}

      {/* Background Image */}
      <img
        src={image}
        alt="bg-login.jpg"
        className="absolute left-0 w-full h-full object-cover"
      />

      {/* Main Form Container */}
      <div className="absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex">
        <div className="p-8 bg-white rounded-md min-w-[500px] flex flex-col gap-6 transition-all duration-300 ease-in-out">
          <h1 className="text-2xl font-bold text-main text-center">
            {uiState.isRegister ? "Create your own account" : "Login"}
          </h1>

          {/* Conditionally render Register or Login component */}
          {uiState.isRegister ? (
            <Register
              invalidField={invalidField}
              setInvalidField={setInvalidField}
              payload={payload}
              setPayload={setPayload}
              setUiState={setUiState}
              handleSubmit={handleSubmit}
            />
          ) : (
            <Login
              invalidField={invalidField}
              setInvalidField={setInvalidField}
              payload={payload}
              setPayload={setPayload}
              handleSubmit={handleSubmit}
              setUiState={setUiState}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
