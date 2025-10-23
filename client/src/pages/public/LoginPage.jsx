import React, { useCallback, useRef, useState } from "react";
import image from "../../assets/bg-login.jpg";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import path from "@/ultils/path";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { apiForgotPassword } from "@/apis/authApi";
import { validate } from "@/ultils/helpers";

import Header from "@/components/Header/Header";
import Register from "@/components/Auth/Register";
import Login from "@/components/Auth/Login";
import ForgotPassword from "@/components/Auth/ForgotPassword";
import LoadingOverlay from "@/components/Common/Loading";
const LoginPage = () => {
  const { login, register, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [invalidField, setInvalidField] = useState([]);
  const timeoutRef = useRef(null);

  const [uiState, setUiState] = useState({
    isRegister: false,
    isForgotPassword: false,
    animation: "animate-slide-in",
  });

  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    mobile: "",
  });

  const navigate = useNavigate();
  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      mobile: "",
    });
  };
  const handleSubmit = useCallback(async () => {
    const invalids = uiState.isRegister
      ? validate(payload, setInvalidField)
      : validate(
          { email: payload.email, password: payload.password },
          setInvalidField
        );
    if (invalids === 0) {
      if (uiState.isRegister) {
        const response = await register(payload);
        if (response.success) {
          Swal.fire(
            "You created your account successfully! But you need to verify your email before login. Go to your email to verify now!",
            response.mes,
            "success"
          ).then(() => {
            setUiState((prev) => ({ ...prev, isRegister: true }));
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
        const { email, password } = payload;

        const response = await login({ email, password });
        if (response.success) {
          Swal.fire({
            title: "Login Successful!",
            text: "Welcome back!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            navigate(`/${path.HOME}`);
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
  }, [uiState.isRegister, payload, register, login, navigate]);

  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    console.log(response);

    if (response.success) {
      Swal.fire(
        "We have sent a password reset link to your email. Please check your inbox.",
        response.mes,
        "success"
      ).then(() => {
        setEmail("");
      });
    } else {
      Swal.fire(
        "Oops something went wrong! Cannot process your request, please try again!",
        response.error || response.message,
        "error"
      );
    }
  };

  const handleBack = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setUiState((prev) => ({ ...prev, animation: "animate-slide-out" }));

    timeoutRef.current = setTimeout(() => {
      setUiState((prev) => ({ ...prev, isForgotPassword: false }));
    }, 400);
  };

  return (
    <div className="w-screen h-screen flex flex-col relative ">
      {isLoading && <LoadingOverlay />}
      <Header />
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
      <img
        src={image}
        alt="bg-login.jpg"
        className="absolute left-0 w-full h-full object-cover"
      />
      <div className="absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex">
        <div className="p-8 bg-white rounded-md min-w-[500px] flex flex-col gap-6 transition-all duration-300 ease-in-out">
          <h1 className="text-2xl font-bold text-main text-center">
            {uiState.isRegister ? "Create your own account" : "Login"}
          </h1>
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
