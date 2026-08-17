import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
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
          maxWidth: "400px",
        }}
      >
        <h1
          style={{
            marginTop: "0",
            color: "#111827",
            fontSize: "28px",
            marginBottom: "20px",
          }}
        >
          Dashboard
        </h1>

        <h2
          style={{
            color: "#1f2937",
            fontSize: "22px",
            margin: "10px 0",
          }}
        >
          Welcome, {user.name}
        </h2>

        <p
          style={{
            color: "#6b7280",
            fontSize: "16px",
            marginBottom: "30px",
          }}
        >
          Email: {user.email}
        </p>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#ef4444",
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
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
