import { useState } from "react";
import authService from "../services/auth.services";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";

      setUiState({
        isLoading: false,
        errorMsg: errorMessage,
        successMsg: "",
      });
    }
  };
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
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
