import { useState, useCallback } from "react";
import authService from "../services/auth.services";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";
import PasswordInput from "../components/PasswordInput";

const Login = () => {
  const { setUser, setAccessToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [uiState, setUiState] = useState({
    isLoading: false,
    errorMsg: "",
    successMsg: "",
  });

  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState({
    isLoading: false,
    msg: "",
    isError: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowResend(false);
    setResendStatus({ isLoading: false, msg: "", isError: false });
    setUiState({ isLoading: true, errorMsg: "", successMsg: "" });

    try {
      const result = await authService.login(formData);
      setUser(result.data.user);
      setAccessToken(result.data.accessToken);

      setUiState({
        isLoading: false,
        errorMsg: "",
        successMsg: result.message || "Logged in successfully!",
      });
      setFormData({ email: "", password: "" });
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 403) {
        setShowResend(true);
      }

      const errorMessage =
        error.response?.data?.message || "Login failed. Please check your credentials.";

      setUiState({
        isLoading: false,
        errorMsg: errorMessage,
        successMsg: "",
      });
    }
  };

  const handleResendClick = async () => {
    if (!formData.email) {
      setResendStatus({
        isLoading: false,
        msg: "Please enter your email address above.",
        isError: true,
      });
      return;
    }

    setResendStatus({ isLoading: true, msg: "", isError: false });
    try {
      const res = await authService.resendVerification(formData.email);
      setResendStatus({
        isLoading: false,
        msg: res.message || "Verification link sent! Check your email inbox.",
        isError: false,
      });
    } catch (err) {
      setResendStatus({
        isLoading: false,
        msg: err.response?.data?.message || "Failed to resend verification email.",
        isError: true,
      });
    }
  };

  const handleGoogleLogin = useCallback(
    async (credential) => {
      setUiState({
        isLoading: true,
        errorMsg: "",
        successMsg: "",
      });

      try {
        const result = await authService.googleLogin(credential);
        setUser(result.data.user);
        setAccessToken(result.data.accessToken);
        navigate("/dashboard");
      } catch (error) {
        setUiState({
          isLoading: false,
          errorMsg: error.response?.data?.message || "Google login failed.",
          successMsg: "",
        });
      }
    },
    [setUser, setAccessToken, navigate]
  );

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Welcome Back 👋</h2>
        <p>Please enter your details to sign in</p>
      </div>

      {/* Alert Error Banners */}
      {uiState.errorMsg && (
        <div className="alert-banner error">
          <span>{uiState.errorMsg}</span>
          {showResend && (
            <div style={{ marginTop: "8px" }}>
              <button
                type="button"
                onClick={handleResendClick}
                disabled={resendStatus.isLoading}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#059669",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {resendStatus.isLoading ? "Resending..." : "Resend Verification Link"}
              </button>
            </div>
          )}
        </div>
      )}

      {resendStatus.msg && (
        <div
          className={`alert-banner ${resendStatus.isError ? "error" : "success"}`}
        >
          <span>{resendStatus.msg}</span>
        </div>
      )}

      {uiState.successMsg && (
        <div className="alert-banner success">
          <span>{uiState.successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <label htmlFor="password" style={{ margin: 0 }}>
              Password
            </label>
            <Link to="/forgot-password" className="link-styled" style={{ fontSize: "12px" }}>
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
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
              <span>Signing In...</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p style={{ marginTop: "20px", fontSize: "14px", color: "#64748b" }}>
        Don't have an account?{" "}
        <Link to="/signup" className="link-styled">
          Sign Up
        </Link>
      </p>

      <div className="divider">
        <span>OR</span>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <GoogleLoginButton onSuccess={handleGoogleLogin} />
      </div>
    </div>
  );
};

export default Login;
