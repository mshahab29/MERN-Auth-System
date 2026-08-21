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
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h2>User Area (User + Admin) 👤</h2>
      {loading && <p>Loading user area...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#eef6ff",
            borderRadius: "8px",
            border: "1px solid #b6d4fe",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#055160" }}>{data.message}</h3>
          <p style={{ margin: "8px 0" }}>
            <strong>Logged User:</strong> {data.user?.name} ({data.user?.email})
          </p>
          <p style={{ margin: "8px 0" }}>
            <strong>Assigned Role:</strong>{" "}
            <span
              style={{
                fontWeight: "bold",
                color: "#0d6efd",
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

export default UserArea;
