import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authService from "../services/auth.services";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Register = () => {
  const { setUser, setAccessToken } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [uiState, setUiState] = useState({
    isLoading: false,
    errorMsg: "",
    successMsg: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setUiState({
        isLoading: false,
        errorMsg: "Passwords do not match",
        successMsg: "",
      });
      return;
    }

    setUiState({ isLoading: true, errorMsg: "", successMsg: "" });
    try {
      const result = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setUiState({
        isLoading: false,
        errorMsg: "",
        successMsg:
          result.message ||
          "Account created successfully! Redirecting to login...",
      });
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      setUiState({
        isLoading: false,
        errorMsg: errorMessage,
        successMsg: "",
      });
    }
  };

  const handleGoogleSignup = useCallback(
    async (credential) => {
      setUiState({
        isLoading: true,
        errorMsg: "",
        successMsg: "",
      });

      try {
        const result = await authService.googleSignup(credential);

        setUser(result.data.user);
        setAccessToken(result.data.accessToken);

        navigate("/dashboard");
      } catch (error) {
        setUiState({
          isLoading: false,
          errorMsg: error.response?.data?.message || "Google signup failed.",
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
      <h2>Create an Account</h2>

      {/* Feedback Messages */}
      {uiState.errorMsg && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {uiState.errorMsg}
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
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
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
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
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
          {uiState.isLoading ? "Registering..." : "Sign Up"}
        </button>
      </form>
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Already have an account? <Link to="/login">Log In</Link>
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
        <GoogleLoginButton onSuccess={handleGoogleSignup} />
      </div>
    </div>
  );
};

export default Register;
