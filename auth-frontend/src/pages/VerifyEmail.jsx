import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import authService from "../services/auth.services";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);

  const [alreadyVerified, setAlreadyVerified] = useState(false);

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
        if (result.data?.alreadyVerified) {
          setAlreadyVerified(true);
        }
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

  const [resendEmail, setResendEmail] = useState("");
  const [resendState, setResendState] = useState({
    isLoading: false,
    message: "",
    isError: false,
  });

  const handleResend = async (e) => {
    e.preventDefault();
    setResendState({ isLoading: true, message: "", isError: false });

    try {
      const res = await authService.resendVerification(resendEmail);
      setResendState({
        isLoading: false,
        message: res.message || "Verification link sent! Please check your inbox.",
        isError: false,
      });
      setResendEmail("");
    } catch (err) {
      setResendState({
        isLoading: false,
        message: err.response?.data?.message || "Failed to resend verification link.",
        isError: true,
      });
    }
  };

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
          <h2>
            {alreadyVerified
              ? "Email Already Verified ℹ️"
              : "Email Verified Successfully! ✅"}
          </h2>
          <p>{message}</p>

          <Link to="/login">Go to Login</Link>
        </>
      )}

      {status === "error" && (
        <>
          <h2>Verification Failed ❌</h2>
          <p>{message}</p>

          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#fafafa",
            }}
          >
            <h3>Need a new verification link?</h3>
            <form onSubmit={handleResend} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                required
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
              <button
                type="submit"
                disabled={resendState.isLoading}
                style={{
                  padding: "10px",
                  backgroundColor: "#007BFF",
                  color: "#FFF",
                  border: "none",
                  borderRadius: "4px",
                  cursor: resendState.isLoading ? "not-allowed" : "pointer",
                }}
              >
                {resendState.isLoading ? "Sending..." : "Resend Verification Email"}
              </button>
            </form>

            {resendState.message && (
              <p style={{ color: resendState.isError ? "red" : "green", marginTop: "10px" }}>
                {resendState.message}
              </p>
            )}
          </div>

          <div style={{ marginTop: "20px" }}>
            <Link to="/login">Go to Login</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
