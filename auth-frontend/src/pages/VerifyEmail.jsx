import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import authService from "../services/auth.services";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const verify = async () => {
      try {
        const result = await authService.verifyEmail(token);

        setStatus("success");
        setMessage(result.message || "Email verified successfully!");
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Email verification failed. The link may be invalid or expired.",
        );
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "100px auto",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      {status === "verifying" && (
        <>
          <h2>Verifying your email...</h2>
          <p>Please wait.</p>
        </>
      )}

      {status === "success" && (
        <>
          <h2>Email Verified Successfully! ✅</h2>
          <p>{message}</p>

          <Link to="/login">Go to Login</Link>
        </>
      )}

      {status === "error" && (
        <>
          <h2>Verification Failed ❌</h2>
          <p>{message}</p>

          <Link to="/login">Go to Login</Link>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
