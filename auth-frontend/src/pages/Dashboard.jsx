import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import ActiveSessions from "../components/ActiveSessions";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "40px 20px",
        gap: "30px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <h1
          style={{
            marginTop: "0",
            color: "#111827",
            fontSize: "28px",
            marginBottom: "10px",
          }}
        >
          Dashboard
        </h1>

        <div style={{ marginBottom: "20px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "12px",
              backgroundColor: user?.role === "admin" ? "#f8d7da" : "#cff4fc",
              color: user?.role === "admin" ? "#842029" : "#055160",
              fontWeight: "bold",
              fontSize: "14px",
              textTransform: "uppercase",
            }}
          >
            Role: {user?.role}
          </span>
        </div>

        <h2
          style={{
            color: "#1f2937",
            fontSize: "22px",
            margin: "10px 0",
          }}
        >
          Welcome, {user?.name}
        </h2>

        <p
          style={{
            color: "#6b7280",
            fontSize: "16px",
            marginBottom: "25px",
          }}
        >
          Email: {user?.email}
        </p>

        {/* RBAC Quick Navigation Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "25px",
          }}
        >
          <Link
            to="/user-area"
            style={{
              padding: "10px",
              backgroundColor: "#0d6efd",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            Go to User Area 👤
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/admin-area"
              style={{
                padding: "10px",
                backgroundColor: "#dc3545",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "bold",
              }}
            >
              Go to Admin Panel 🛡️
            </Link>
          )}
        </div>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#6c757d",
            color: "#ffffff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            width: "100%",
            transition: "background-color 0.2s",
          }}
        >
          Logout Current Device
        </button>
      </div>

      {/* Security - Active Sessions Management Section */}
      <div style={{ width: "100%", maxWidth: "450px" }}>
        <ActiveSessions />
      </div>
    </div>
  );
};

export default Dashboard;
