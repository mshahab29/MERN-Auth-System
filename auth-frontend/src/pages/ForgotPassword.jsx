import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/auth.services";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [uiState, setUiState] = useState({
    isLoading: false,
    isSuccess: false,
    errorMsg: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiState({ isLoading: true, isSuccess: false, errorMsg: "" });

    try {
      await authService.forgotPassword(email);
    } catch (error) {
      // Only expose actual server crashes (500s) or network failures
      if (!error.response || error.response.status >= 500) {
        setUiState({
          isLoading: false,
          isSuccess: false,
          errorMsg: "Network or server error. Please try again later.",
        });
        return;
      }
      // If the backend returns a 404 (User not found), we silently catch it
      // and proceed to the success state below to prevent email enumeration.
    }

    // Always display this message if the request completes, hiding account existence
    setUiState({
      isLoading: false,
      isSuccess: true,
      errorMsg: "",
    });
    setEmail("");
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <h2>Forgot Password?</h2>

      <p style={{ color: "#555", fontSize: "14px", marginBottom: "20px" }}>
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      {uiState.errorMsg && (
        <div
          style={{
            color: "red",
            marginBottom: "15px",
            padding: "10px",
            backgroundColor: "#ffe6e6",
            borderRadius: "4px",
          }}
        >
          {uiState.errorMsg}
        </div>
      )}

      {uiState.isSuccess ? (
        <div
          style={{
            color: "green",
            marginBottom: "15px",
            padding: "15px",
            backgroundColor: "#e6ffe6",
            borderRadius: "4px",
            border: "1px solid #b3ffb3",
          }}
        >
          If an account exists with this email, a password reset link has been
          sent.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
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
              cursor: uiState.isLoading ? "not-allowed" : "pointer",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {uiState.isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}

      <div style={{ marginTop: "20px" }}>
        <Link to="/login" style={{ color: "#007BFF", textDecoration: "none" }}>
          &larr; Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
