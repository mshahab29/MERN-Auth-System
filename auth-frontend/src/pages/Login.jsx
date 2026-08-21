import { useState, useCallback } from "react";
import authService from "../services/auth.services";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";

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
  const [resendStatus, setResendStatus] = useState("");

  const handleResendClick = async () => {
    if (!formData.email) {
      setResendStatus("Please enter your email above.");
      return;
    }
    setResendStatus("Sending...");
    try {
      await authService.resendVerification(formData.email);
      setResendStatus("Verification link sent! Check your inbox.");
    } catch (err) {
      setResendStatus(
        err.response?.data?.message || "Failed to resend verification email.",
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowResend(false);
    setResendStatus("");
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
        error.response?.data?.message || "Login failed. Please try again.";

      setUiState({
        isLoading: false,
        errorMsg: errorMessage,
        successMsg: "",
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
    [setUser, setAccessToken, navigate],
  );

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Login</h2>

      {/* Feedback Messages */}
      {uiState.errorMsg && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {uiState.errorMsg}
          {showResend && (
            <div style={{ marginTop: "8px" }}>
              <button
                type="button"
                onClick={handleResendClick}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Resend Verification Link
              </button>
            </div>
          )}
        </div>
      )}
      {resendStatus && (
        <div style={{ color: "#0056b3", marginBottom: "10px", fontSize: "14px" }}>
          {resendStatus}
        </div>
      )}
      {uiState.successMsg && (
        <div style={{ color: "green", marginBottom: "10px" }}>
          {uiState.successMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <button
          type="submit"
          disabled={uiState.isLoading}
          style={{
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "#FFF",
            border: "none",
            cursor: "pointer",
          }}
        >
          {uiState.isLoading ? "Logging in..." : "Sign In"}
        </button>
      </form>

      <div style={{ textAlign: "right" }}>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>

      {/* Visual OR Divider */}
      <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
        <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} />
        <span style={{ padding: "0 10px", color: "#666", fontSize: "14px" }}>
          OR
        </span>
        <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <GoogleLoginButton onSuccess={handleGoogleLogin} />
      </div>
    </div>
  );
};

export default Login;
