import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import authService from "../services/auth.services";
import PasswordInput from "../components/PasswordInput";
import PasswordRequirements from "../components/PasswordRequirements";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [step, setStep] = useState(token ? "form" : "invalid"); // "form" | "invalid" | "success"
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [uiState, setUiState] = useState({
    isLoading: false,
    errorMsg: "",
  });

  const [redirectCountdown, setRedirectCountdown] = useState(5);

  useEffect(() => {
    let timer;
    if (step === "success" && redirectCountdown > 0) {
      timer = setInterval(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
    } else if (step === "success" && redirectCountdown === 0) {
      navigate("/login");
    }
    return () => clearInterval(timer);
  }, [step, redirectCountdown, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiState({ isLoading: true, errorMsg: "" });

    if (formData.password !== formData.confirmPassword) {
      setUiState({
        isLoading: false,
        errorMsg: "Passwords do not match. Please check and try again.",
      });
      return;
    }

    try {
      await authService.resetPassword(token, formData.password);
      setStep("success");
      setUiState({ isLoading: false, errorMsg: "" });
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Failed to reset password. Link may be expired.";
      
      if (
        errMsg.toLowerCase().includes("invalid") ||
        errMsg.toLowerCase().includes("expired")
      ) {
        setStep("invalid");
      } else {
        setUiState({
          isLoading: false,
          errorMsg: errMsg,
        });
      }
    }
  };

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  return (
    <div className="auth-card">
      {/* 1. Invalid or Missing Token State */}
      {step === "invalid" && (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={{ fontSize: "54px", marginBottom: "16px" }}>❌</div>
          <div className="auth-header">
            <h2>Link Expired or Invalid</h2>
            <p>
              This password reset link is invalid or has expired. Password reset links are
              only valid for 15 minutes for your security.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
            <Link to="/forgot-password" className="btn-primary" style={{ textDecoration: "none" }}>
              Request New Reset Link
            </Link>

            <Link to="/login" className="link-styled" style={{ marginTop: "8px" }}>
              Return to Sign In
            </Link>
          </div>
        </div>
      )}

      {/* 2. Reset Password Form State */}
      {step === "form" && (
        <>
          <div className="auth-header">
            <h2>Reset Password 🔒</h2>
            <p>Enter your new password below to update your account access.</p>
          </div>

          {uiState.errorMsg && (
            <div className="alert-banner error">
              <span>{uiState.errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                autoComplete="new-password"
              />
              <PasswordRequirements password={formData.password} />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat new password"
                autoComplete="new-password"
              />
              {formData.confirmPassword.length > 0 && (
                <p
                  style={{
                    fontSize: "12px",
                    marginTop: "4px",
                    fontWeight: "600",
                    color: passwordsMatch ? "#059669" : "#dc2626",
                  }}
                >
                  {passwordsMatch ? "✓ Passwords match" : "✕ Passwords do not match"}
                </p>
              )}
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
                  <span>Updating Password...</span>
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Link to="/login" className="link-styled">
              &larr; Back to Sign In
            </Link>
          </div>
        </>
      )}

      {/* 3. Reset Password Success State */}
      {step === "success" && (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={{ fontSize: "54px", marginBottom: "16px" }}>🛡️</div>
          <div className="auth-header">
            <h2>Password Changed!</h2>
            <p>Your password has been successfully updated. All active sessions have been secured.</p>
          </div>

          <div
            className="alert-banner success"
            style={{ margin: "20px 0", textAlign: "center" }}
          >
            <span>Redirecting to Sign In in {redirectCountdown} seconds...</span>
          </div>

          <Link to="/login" className="btn-primary" style={{ textDecoration: "none" }}>
            Sign In Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
