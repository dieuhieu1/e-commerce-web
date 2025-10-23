import React from "react";
import { LuLogIn } from "react-icons/lu";
import InputField from "../Input/InputField";
import Button from "../Common/Button";

const Login = ({
  invalidField,
  setInvalidField,
  payload,
  setPayload,
  handleSubmit,
  setUiState,
}) => {
  return (
    <>
      <InputField
        invalidField={invalidField}
        setInvalidField={setInvalidField}
        label="Email"
        type="email"
        name="email"
        value={payload.email}
        setValue={setPayload}
        fullWidth
      />
      <InputField
        invalidField={invalidField}
        setInvalidField={setInvalidField}
        label="Password"
        type="password"
        name="password"
        value={payload.password}
        setValue={setPayload}
        fullWidth
      />
      <Button
        variant="primary"
        size="lg"
        fullWidth
        leftIcon={LuLogIn}
        onClick={handleSubmit}
        className="cursor-pointer"
      >
        Login
      </Button>
      <div className="w-full text-sm flex items-center justify-between my-2 ">
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => {
            setUiState((prev) => ({
              ...prev,
              isForgotPassword: true,
              animation: "animate-slide-in",
            }));
            setInvalidField([]);
          }}
        >
          Forgot your account?
        </span>
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => {
            setUiState((prev) => ({
              ...prev,
              isRegister: true,
            }));

            setInvalidField([]);
          }}
        >
          Create new account
        </span>
      </div>
    </>
  );
};

export default Login;
