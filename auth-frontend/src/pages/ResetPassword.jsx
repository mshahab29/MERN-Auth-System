import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import authService from "../services/auth.services";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [uiState, setUiState] = useState({
    isLoading: false,
    isSuccess: false,
    errorMsg: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Check if token exists in the URL
    if (!token) {
      setUiState({ ...uiState, errorMsg: "Invalid or missing reset token." });
      return;
    }

    // 2. Validate passwords match before sending request
    if (password !== confirmPassword) {
      setUiState({ ...uiState, errorMsg: "Passwords do not match" });
      return;
    }

    setUiState({ isLoading: true, isSuccess: false, errorMsg: "" });

    try {
      // 3. Send the token and new password to the backend
      await authService.resetPassword(token, password);

      setUiState({
        isLoading: false,
        isSuccess: true,
        errorMsg: "",
      });
    } catch (error) {
      setUiState({
        isLoading: false,
        isSuccess: false,
        errorMsg:
          error.response?.data?.message ||
          "Failed to reset password. The link may have expired.",
      });
    }
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
      {/* Success State */}
      {uiState.isSuccess ? (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#e6ffe6",
            borderRadius: "8px",
            border: "1px solid #b3ffb3",
          }}
        >
          <h2 style={{ color: "green", marginTop: 0 }}>
            Password Reset Successfully ✅
          </h2>
          <p style={{ color: "#333", marginBottom: "20px" }}>
            Your password has been changed.
          </p>
          <Link
            to="/login"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#FFF",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            Go to Login
          </Link>
        </div>
      ) : (
        /* Form State */
        <>
          <h2>Reset Password</h2>

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

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              textAlign: "left",
            }}
          >
            <div>
              <label
                htmlFor="newPassword"
                style={{ display: "block", marginBottom: "5px" }}
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="8"
                style={{
                  width: "100%",
                  padding: "10px",
                  boxSizing: "border-box",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="8"
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
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#007BFF",
                color: "#FFF",
                border: "none",
                cursor: uiState.isLoading ? "not-allowed" : "pointer",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              {uiState.isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
