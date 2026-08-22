import { useEffect, useState } from "react";
import authService from "../services/auth.services";
import { useAuth } from "../context/AuthContext";

const DesktopIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#475569"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#475569"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--primary)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

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

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="auth-card" style={{ textAlign: "left", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <ShieldIcon />
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main)" }}>
          Active Sessions & Security
        </h3>
      </div>

      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
        Manage all active logins across your devices and revoke unrecognized sessions.
      </p>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 0" }}>
          <div
            className="spinner"
            style={{
              width: "18px",
              height: "18px",
              borderTopColor: "var(--primary)",
              borderColor: "rgba(0,112,243,0.2)",
            }}
          ></div>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Loading active sessions...</span>
        </div>
      )}

      {error && (
        <div className="alert-banner error" style={{ marginBottom: "16px" }}>
          <span>{error}</span>
        </div>
      )}

      {actionMessage && (
        <div className="alert-banner success" style={{ marginBottom: "16px" }}>
          <span>{actionMessage}</span>
        </div>
      )}

      {!loading && sessions.length === 0 && (
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>No active sessions found.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sessions.map((session) => (
          <div
            key={session.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderRadius: "10px",
              backgroundColor: session.isCurrent ? "#f0fdf4" : "#f8fafc",
              border: `1px solid ${session.isCurrent ? "#bbf7d0" : "#e2e8f0"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  backgroundColor: session.isCurrent ? "#dcfce7" : "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {session.deviceType === "mobile" ? <PhoneIcon /> : <DesktopIcon />}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                  {session.device}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                  {session.isCurrent ? (
                    <span style={{ color: "#16a34a", fontWeight: "600" }}>Current Session</span>
                  ) : (
                    <span>Logged in on {formatDate(session.createdAt)}</span>
                  )}
                  {session.ip && session.ip !== "Unknown IP" && (
                    <span style={{ marginLeft: "8px", color: "#94a3b8" }}>• IP: {session.ip}</span>
                  )}
                </div>
              </div>
            </div>

            {!session.isCurrent && (
              <button
                onClick={() => handleRevoke(session.id)}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#dc2626",
                  backgroundColor: "#ffffff",
                  border: "1px solid #fecaca",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>

      {otherSessionsCount > 0 && (
        <button
          onClick={handleRevokeOthers}
          style={{
            marginTop: "18px",
            width: "100%",
            padding: "10px",
            fontSize: "13px",
            fontWeight: "600",
            color: "#dc2626",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Logout all other devices ({otherSessionsCount})
        </button>
      )}
    </div>
  );
};

export default ActiveSessions;
