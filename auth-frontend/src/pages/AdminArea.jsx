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
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Admin Control Panel (Admin Only) 🛡️</h2>
      {loading && <p>Loading admin panel...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff3cd",
            borderRadius: "8px",
            border: "1px solid #ffecb5",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#664d03" }}>{data.message}</h3>
          <p style={{ margin: "8px 0" }}>
            <strong>Admin Name:</strong> {data.user?.name}
          </p>
          <p style={{ margin: "8px 0" }}>
            <strong>Admin Email:</strong> {data.user?.email}
          </p>
          <p style={{ margin: "8px 0" }}>
            <strong>Role Privilege:</strong>{" "}
            <span
              style={{
                fontWeight: "bold",
                color: "#dc3545",
                textTransform: "uppercase",
              }}
            >
              {data.user?.role}
            </span>
          </p>
        </div>
      )}
      <div style={{ marginTop: "25px" }}>
        <Link
          to="/dashboard"
          style={{ color: "#007BFF", textDecoration: "none" }}
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AdminArea;
