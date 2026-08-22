import { useEffect, useState } from "react";
import authService from "../services/auth.services";
import { useAuth } from "../context/AuthContext";

const ActiveSessions = () => {
  const { logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const fetchSessions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.getSessions();
      setSessions(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load active sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (sessionId) => {
    setActionMessage("");
    try {
      const res = await authService.revokeSession(sessionId);
      if (res.data?.isCurrentSession) {
        // If current session was revoked, perform logout
        await logout();
        return;
      }
      setActionMessage("Session logged out successfully.");
      fetchSessions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to logout session.");
    }
  };

  const handleRevokeOthers = async () => {
    setActionMessage("");
    try {
      await authService.revokeOtherSessions();
      setActionMessage("Logged out of all other devices.");
      fetchSessions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to revoke other sessions.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getDeviceIcon = (deviceType) => {
    return deviceType === "mobile" ? "📱" : "💻";
  };

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        padding: "24px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        fontFamily: "sans-serif",
        textAlign: "left",
        maxWidth: "450px",
        margin: "0 auto",
      }}
    >
      <h3
        style={{
          margin: "0 0 4px 0",
          fontSize: "14px",
          color: "#6b7280",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Security
      </h3>
      <h2
        style={{
          margin: "0 0 20px 0",
          fontSize: "20px",
          color: "#111827",
          fontWeight: "700",
        }}
      >
        Active Sessions
      </h2>

      {loading && <p style={{ color: "#6b7280" }}>Loading sessions...</p>}
      {error && (
        <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "12px" }}>
          {error}
        </p>
      )}
      {actionMessage && (
        <p style={{ color: "#10b981", fontSize: "14px", marginBottom: "12px" }}>
          {actionMessage}
        </p>
      )}

      {!loading && sessions.length === 0 && (
        <p style={{ color: "#6b7280" }}>No active sessions found.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {sessions.map((session) => (
          <div
            key={session.id}
            style={{
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: session.isCurrent ? "#f0fdf4" : "#f9fafb",
              border: `1px solid ${session.isCurrent ? "#bbf7d0" : "#e5e7eb"}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1f2937",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>{getDeviceIcon(session.deviceType)}</span>
                <span>{session.device}</span>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginTop: "4px",
                }}
              >
                {session.isCurrent ? (
                  <span
                    style={{
                      color: "#16a34a",
                      fontWeight: "600",
                    }}
                  >
                    Current session
                  </span>
                ) : (
                  <span>{formatDate(session.createdAt)}</span>
                )}
              </div>
            </div>

            {!session.isCurrent && (
              <button
                onClick={() => handleRevoke(session.id)}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#ef4444",
                  border: "1px solid #fca5a5",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Logout
              </button>
            )}
          </div>
        ))}
      </div>

      {otherSessionsCount > 0 && (
        <button
          onClick={handleRevokeOthers}
          style={{
            marginTop: "20px",
            width: "100%",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #fecaca",
            padding: "10px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Logout all other devices
        </button>
      )}
    </div>
  );
};

export default ActiveSessions;
