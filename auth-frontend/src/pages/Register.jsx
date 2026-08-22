import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authService from "../services/auth.services";
import GoogleLoginButton from "../components/GoogleLoginButton";
import PasswordInput from "../components/PasswordInput";
import PasswordRequirements from "../components/PasswordRequirements";

const Register = () => {
  const navigate = useNavigate();
  const { setUser, setAccessToken } = useAuth();

  const [step, setStep] = useState("form"); // "form" | "emailSent"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [registeredEmail, setRegisteredEmail] = useState("");
  const [uiState, setUiState] = useState({
    isLoading: false,
    errorMsg: "",
    resendMsg: "",
    resendLoading: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiState({
      isLoading: true,
      errorMsg: "",
      resendMsg: "",
      resendLoading: false,
    });

    if (formData.password !== formData.confirmPassword) {
      setUiState({
        isLoading: false,
        errorMsg: "Passwords do not match. Please check and try again.",
        resendMsg: "",
        resendLoading: false,
      });
      return;
    }

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setRegisteredEmail(formData.email);
      setStep("emailSent");
      setUiState({
        isLoading: false,
        errorMsg: "",
        resendMsg: "",
        resendLoading: false,
      });
    } catch (error) {
      setUiState({
        isLoading: false,
        errorMsg:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
        resendMsg: "",
        resendLoading: false,
      });
    }
  };

  const handleResend = async () => {
    setUiState((prev) => ({ ...prev, resendLoading: true, resendMsg: "" }));
    try {
      const res = await authService.resendVerification(registeredEmail);
      setUiState((prev) => ({
        ...prev,
        resendLoading: false,
        resendMsg:
          res.message || "Verification email resent! Please check your inbox.",
      }));
    } catch (err) {
      setUiState((prev) => ({
        ...prev,
        resendLoading: false,
        errorMsg:
          err.response?.data?.message || "Failed to resend verification email.",
      }));
    }
  };

  const handleGoogleSignup = useCallback(
    async (credential) => {
      setUiState({
        isLoading: true,
        errorMsg: "",
        resendMsg: "",
        resendLoading: false,
      });
      try {
        const result = await authService.googleSignup(credential);
        setUser(result.data.user);
        setAccessToken(result.data.accessToken);
        navigate("/dashboard");
      } catch (error) {
        setUiState({
          isLoading: false,
          errorMsg: error.response?.data?.message || "Google Sign-Up failed.",
          resendMsg: "",
          resendLoading: false,
        });
      }
    },
    [setUser, setAccessToken, navigate],
  );

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  return (
    <div className="auth-card">
      {step === "form" ? (
        <>
          <div className="auth-header">
            <h2>Create an Account 🚀</h2>
            <p>Sign up to get started with your new account</p>
          </div>

          {uiState.errorMsg && (
            <div className="alert-banner error">
              <span>{uiState.errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
              <PasswordRequirements password={formData.password} />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
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
                  {passwordsMatch
                    ? "✓ Passwords match"
                    : "✕ Passwords do not match"}
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
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p style={{ marginTop: "16px", fontSize: "14px", color: "#64748b" }}>
            Already have an account?{" "}
            <Link to="/login" className="link-styled">
              Sign In
            </Link>
          </p>

          <div className="divider">
            <span>OR</span>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleLoginButton onSuccess={handleGoogleSignup} />
          </div>
        </>
      ) : (
        /* Step 2: Post-Signup Email Sent Confirmation Screen */
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={{ fontSize: "54px", marginBottom: "16px" }}>📩</div>
          <div className="auth-header" style={{ marginBottom: "16px" }}>
            <h2>Check Your Email</h2>
            <p>Verification email sent to:</p>
            <p
              style={{
                fontWeight: "700",
                color: "#0f172a",
                fontSize: "15px",
                marginTop: "4px",
              }}
            >
              {registeredEmail}
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
            We've sent a 15-minute activation link to your email address. Please
            open your inbox and click the verification link to complete your
            signup.
          </p>

          {uiState.resendMsg && (
            <div
              className="alert-banner success"
              style={{ marginBottom: "16px" }}
            >
              <span>{uiState.resendMsg}</span>
            </div>
          )}

          {uiState.errorMsg && (
            <div
              className="alert-banner error"
              style={{ marginBottom: "16px" }}
            >
              <span>{uiState.errorMsg}</span>
            </div>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <button
              onClick={handleResend}
              disabled={uiState.resendLoading}
              className="btn-outline"
            >
              {uiState.resendLoading
                ? "Resending Email..."
                : "Resend Verification Email"}
            </button>

            <Link
              to="/login"
              className="btn-primary"
              style={{ textDecoration: "none" }}
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
