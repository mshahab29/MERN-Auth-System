import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="auth-card" style={{ textAlign: "center" }}>
      <div style={{ fontSize: "54px", marginBottom: "16px" }}>🚫</div>
      <div className="auth-header">
        <h1 style={{ fontSize: "28px", color: "#dc2626" }}>403 - Access Denied</h1>
        <p>You do not have the required permissions to access this page.</p>
      </div>

      <div style={{ marginTop: "24px" }}>
        <Link to="/dashboard" className="btn-primary" style={{ textDecoration: "none" }}>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
