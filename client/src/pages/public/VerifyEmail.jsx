import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verificationStatus = searchParams.get("verification");
  useEffect(() => {
    // Correct logic for the SUCCESS case
    if (verificationStatus === "success") {
      Swal.fire(
        "Congratulations!", // Correct title
        "Email verified successfully! Go to login to exprience our website.", // Correct message
        "success" // Use the 'success' icon
      ).then(() => navigate("/login"));
    }

    // Correct logic for the FAILED case
    if (verificationStatus === "failed") {
      Swal.fire(
        "Oops!", // Correct title
        "Email verification failed. The link may be invalid or expired.", // Correct message
        "error" // Use the 'error' icon
      ).then(() => navigate("/login"));
    }
  }, [navigate, verificationStatus]);

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <p>Verifying your email...</p>
    </div>
  );
};

export default VerifyEmail;
