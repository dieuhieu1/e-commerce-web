import React from "react";
import { FaPenToSquare } from "react-icons/fa6";
import InputField from "../Input/InputField";
import Button from "../Common/Button";

const Register = ({
  invalidField,
  setInvalidField,
  payload,
  setPayload,
  setUiState,
  handleSubmit,
}) => {
  return (
    <>
      <div className="flex gap-3">
        <InputField
          invalidField={invalidField}
          setInvalidField={setInvalidField}
          label="First Name"
          type="text"
          name="firstname"
          value={payload.firstname}
          setValue={setPayload}
          fullWidth
        />
        <InputField
          invalidField={invalidField}
          setInvalidField={setInvalidField}
          label="Last Name"
          type="text"
          name="lastname"
          value={payload.lastname}
          setValue={setPayload}
          fullWidth
        />
      </div>
      <InputField
        invalidField={invalidField}
        setInvalidField={setInvalidField}
        label="Phone Number"
        type="text"
        name="mobile"
        value={payload.mobile}
        setValue={setPayload}
        fullWidth
      />
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
        leftIcon={FaPenToSquare}
        onClick={handleSubmit}
        className="cursor-pointer"
      >
        "Register"
      </Button>
      <span
        className="text-blacks-500 flex gap-1 justify-center "
        onClick={() => {
          setUiState((prev) => ({ ...prev, isRegister: false }));
          setInvalidField([]);
        }}
      >
        Already have an Acoount?
        <span className="text-main hover:underline cursor-pointer">
          Go to Login
        </span>
      </span>
    </>
  );
};

export default Register;
