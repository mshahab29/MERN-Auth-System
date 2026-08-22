import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import rbacService from "../services/rbac.services";

const AdminArea = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await rbacService.getAdminArea();
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin area.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Admin Control Panel (Admin Only) 🛡️</h2>
        <p>High-privilege management section restricted to administrators</p>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div
            className="spinner"
            style={{
              width: "28px",
              height: "28px",
              margin: "0 auto 10px",
              borderTopColor: "#dc2626",
              borderColor: "rgba(220, 38, 38, 0.2)",
            }}
          ></div>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Loading admin panel...</p>
        </div>
      )}

      {error && (
        <div className="alert-banner error">
          <span>{error}</span>
        </div>
      )}

      {data && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff7ed",
            borderRadius: "8px",
            border: "1px solid #ffedd5",
            textAlign: "left",
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "16px", color: "#c2410c", marginBottom: "12px" }}>
            {data.message}
          </h3>
          <p style={{ margin: "6px 0", fontSize: "14px", color: "#334155" }}>
            <strong>Admin Name:</strong> {data.user?.name}
          </p>
          <p style={{ margin: "6px 0", fontSize: "14px", color: "#334155" }}>
            <strong>Admin Email:</strong> {data.user?.email}
          </p>
          <p style={{ margin: "6px 0", fontSize: "14px", color: "#334155" }}>
            <strong>Role Privilege:</strong>{" "}
            <span
              style={{
                fontWeight: "700",
                color: "#dc2626",
                textTransform: "uppercase",
              }}
            >
              {data.user?.role}
            </span>
          </p>
        </div>
      )}

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <Link to="/dashboard" className="link-styled">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AdminArea;
