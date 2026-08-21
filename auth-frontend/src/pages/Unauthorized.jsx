import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "100px auto",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ color: "#dc3545", fontSize: "36px", marginBottom: "10px" }}>
        403 - Access Denied 🚫
      </h1>
      <p style={{ color: "#555", fontSize: "16px", marginBottom: "30px" }}>
        You do not have the required permissions to access this resource.
      </p>
      <div>
        <Link
          to="/dashboard"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
