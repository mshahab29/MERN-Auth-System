import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import authService from "../services/auth.services";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "already_verified" | "error"
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing from the link.");
      return;
    }

    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const verify = async () => {
      try {
        const result = await authService.verifyEmail(token);

        if (result.data?.alreadyVerified) {
          setStatus("already_verified");
          setMessage(result.message || "Your email is already verified! You can log in.");
        } else {
          setStatus("success");
          setMessage(result.message || "Email verified successfully!");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Email verification failed. The link may be invalid or expired."
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
    <div className="auth-card" style={{ textAlign: "center" }}>
      {/* 1. Verifying State */}
      {status === "verifying" && (
        <div style={{ padding: "20px 0" }}>
          <div
            className="spinner"
            style={{
              width: "36px",
              height: "36px",
              margin: "0 auto 16px",
              borderTopColor: "var(--primary)",
              borderColor: "rgba(0, 112, 243, 0.2)",
            }}
          ></div>
          <div className="auth-header">
            <h2>Verifying your email...</h2>
            <p>Please wait a moment while we process your request.</p>
          </div>
        </div>
      )}

      {/* 2. Success State */}
      {status === "success" && (
        <div style={{ padding: "10px 0" }}>
          <div style={{ fontSize: "54px", marginBottom: "16px" }}>✅</div>
          <div className="auth-header">
            <h2>Email Verified!</h2>
            <p>{message}</p>
          </div>

          <Link
            to="/login"
            className="btn-primary"
            style={{ textDecoration: "none", marginTop: "20px" }}
          >
            Continue to Sign In
          </Link>
        </div>
      )}

      {/* 3. Already Verified State */}
      {status === "already_verified" && (
        <div style={{ padding: "10px 0" }}>
          <div style={{ fontSize: "54px", marginBottom: "16px" }}>ℹ️</div>
          <div className="auth-header">
            <h2>Already Verified</h2>
            <p>{message}</p>
          </div>

          <Link
            to="/login"
            className="btn-primary"
            style={{ textDecoration: "none", marginTop: "20px" }}
          >
            Go to Sign In
          </Link>
        </div>
      )}

      {/* 4. Expired / Error State */}
      {status === "error" && (
        <div style={{ padding: "10px 0" }}>
          <div style={{ fontSize: "54px", marginBottom: "16px" }}>❌</div>
          <div className="auth-header">
            <h2>Verification Failed</h2>
            <p>{message}</p>
          </div>

          <div
            style={{
              marginTop: "24px",
              padding: "20px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              backgroundColor: "#f8fafc",
              textAlign: "left",
            }}
          >
            <h4
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              Need a new verification link?
            </h4>
            <p
              style={{
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "14px",
              }}
            >
              Enter your email address below to receive a fresh verification link.
            </p>

            <form onSubmit={handleResend} style={{ display: "grid", gap: "10px" }}>
              <input
                type="email"
                placeholder="you@example.com"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                required
                className="input-field"
              />
              <button
                type="submit"
                disabled={resendState.isLoading}
                className="btn-primary"
              >
                {resendState.isLoading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Sending...</span>
                  </>
                ) : (
                  "Resend Verification Link"
                )}
              </button>
            </form>

            {resendState.message && (
              <div
                className={`alert-banner ${
                  resendState.isError ? "error" : "success"
                }`}
                style={{ marginTop: "12px", marginBottom: 0 }}
              >
                <span>{resendState.message}</span>
              </div>
            )}
          </div>

          <div style={{ marginTop: "20px" }}>
            <Link to="/login" className="link-styled">
              Return to Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
