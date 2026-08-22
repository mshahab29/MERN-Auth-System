import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import authService from "../services/auth.services";

const ForgotPassword = () => {
  const [step, setStep] = useState("form"); // "form" | "emailSent"
  const [email, setEmail] = useState("");
  const [uiState, setUiState] = useState({
    isLoading: false,
    errorMsg: "",
  });

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiState({ isLoading: true, errorMsg: "" });

    try {
      await authService.forgotPassword(email);
      setStep("emailSent");
      setCooldown(60); // 60-second cooldown before allowing resend
      setUiState({ isLoading: false, errorMsg: "" });
    } catch (error) {
      setUiState({
        isLoading: false,
        errorMsg:
          error.response?.data?.message || "Failed to process request. Please try again.",
      });
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setUiState({ isLoading: true, errorMsg: "" });

    try {
      await authService.forgotPassword(email);
      setCooldown(60);
      setUiState({ isLoading: false, errorMsg: "" });
    } catch (error) {
      setUiState({
        isLoading: false,
        errorMsg:
          error.response?.data?.message || "Failed to resend email. Please try again.",
      });
    }
  };

  return (
    <div className="auth-card">
      {step === "form" ? (
        <>
          <div className="auth-header">
            <h2>Forgot Password? 🔑</h2>
            <p>
              Enter your registered email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {uiState.errorMsg && (
            <div className="alert-banner error">
              <span>{uiState.errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={uiState.isLoading}
              className="btn-primary"
              style={{ marginTop: "10px" }}
            >
              {uiState.isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Sending Link...</span>
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Link to="/login" className="link-styled">
              &larr; Back to Sign In
            </Link>
          </div>
        </>
      ) : (
        /* Step 2: "Check Your Email" Confirmation Screen */
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={{ fontSize: "54px", marginBottom: "16px" }}>✉️</div>
          <div className="auth-header" style={{ marginBottom: "16px" }}>
            <h2>Check Your Email</h2>
            <p>Password reset link sent to:</p>
            <p
              style={{
                fontWeight: "700",
                color: "#0f172a",
                fontSize: "15px",
                marginTop: "4px",
              }}
            >
              {email}
            </p>
          </div>

          <p
            style={{
              fontSize: "14px",
              color: "#475569",
              lineHeight: "1.6",
              marginBottom: "24px",
            }}
          >
            If an account exists with this email address, you will receive a reset link
            valid for 15 minutes. Check your inbox and spam folder.
          </p>

          {uiState.errorMsg && (
            <div className="alert-banner error" style={{ marginBottom: "16px" }}>
              <span>{uiState.errorMsg}</span>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || uiState.isLoading}
              className="btn-outline"
            >
              {uiState.isLoading
                ? "Resending..."
                : cooldown > 0
                ? `Didn't receive email? Resend in ${cooldown}s`
                : "Resend Reset Email"}
            </button>

            <Link to="/login" className="btn-primary" style={{ textDecoration: "none" }}>
              Return to Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
