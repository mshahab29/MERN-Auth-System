import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import rbacService from "../services/rbac.services";

const UserArea = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await rbacService.getUserArea();
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user area.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>User Area (User + Admin) 👤</h2>
        <p>Protected area accessible by authenticated users and admins</p>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div
            className="spinner"
            style={{
              width: "28px",
              height: "28px",
              margin: "0 auto 10px",
              borderTopColor: "var(--primary)",
              borderColor: "rgba(0, 112, 243, 0.2)",
            }}
          ></div>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Loading user area...</p>
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
            backgroundColor: "#f0f7ff",
            borderRadius: "8px",
            border: "1px solid #bae6fd",
            textAlign: "left",
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "16px", color: "#0369a1", marginBottom: "12px" }}>
            {data.message}
          </h3>
          <p style={{ margin: "6px 0", fontSize: "14px", color: "#334155" }}>
            <strong>Logged User:</strong> {data.user?.name} ({data.user?.email})
          </p>
          <p style={{ margin: "6px 0", fontSize: "14px", color: "#334155" }}>
            <strong>Assigned Role:</strong>{" "}
            <span
              style={{
                fontWeight: "700",
                color: "#0284c7",
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

export default UserArea;
