import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import ActiveSessions from "../components/ActiveSessions";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Profile Summary Card */}
      <div className="auth-card" style={{ textAlign: "center", padding: "32px 28px" }}>
        {/* User Avatar Circle */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            fontSize: "26px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 4px 12px rgba(0, 112, 243, 0.25)",
            overflow: "hidden",
          }}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            getInitials(user?.name)
          )}
        </div>

        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-main)", margin: "0 0 4px" }}>
          {user?.name}
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "18px" }}>
          {user?.email}
        </p>

        {/* User Badges & Details Tag Grid */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
              backgroundColor: user?.role === "admin" ? "#fef2f2" : "#eff6ff",
              color: user?.role === "admin" ? "#dc2626" : "#2563eb",
              border: `1px solid ${user?.role === "admin" ? "#fecaca" : "#bfdbfe"}`,
              textTransform: "uppercase",
            }}
          >
            Role: {user?.role}
          </span>

          <span
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
              backgroundColor: "#ecfdf5",
              color: "#059669",
              border: "1px solid #a7f3d0",
            }}
          >
            Verified Email ✓
          </span>

          <span
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
              backgroundColor: "#f8fafc",
              color: "#475569",
              border: "1px solid #e2e8f0",
            }}
          >
            Auth: {user?.provider === "google" ? "Google OAuth" : "Local Email"}
          </span>
        </div>

        {/* Navigation Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          <Link
            to="/user-area"
            className="btn-outline"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            Explore User Area 👤
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/admin-area"
              className="btn-outline"
              style={{
                textDecoration: "none",
                textAlign: "center",
                color: "#dc2626",
                borderColor: "#fecaca",
                backgroundColor: "#fff5f5",
              }}
            >
              Access Admin Panel 🛡️
            </Link>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="btn-primary"
          style={{ backgroundColor: "#475569" }}
        >
          Sign Out of Current Device
        </button>
      </div>

      {/* Active Sessions Widget */}
      <ActiveSessions />
    </div>
  );
};

export default Dashboard;
