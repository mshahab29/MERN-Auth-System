const PasswordRequirements = ({ password }) => {
  const requirements = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter (A-Z)", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter (a-z)", valid: /[a-z]/.test(password) },
    { label: "One number (0-9)", valid: /\d/.test(password) },
    {
      label: "One special character (@$!%*?&)",
      valid: /[@$!%*?&]/.test(password),
    },
  ];

  if (!password) return null;

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "10px 12px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        textAlign: "left",
      }}
    >
      <p
        style={{
          fontSize: "12px",
          fontWeight: "600",
          color: "#475569",
          marginBottom: "6px",
        }}
      >
        Password Requirements:
      </p>
      <div style={{ display: "grid", gap: "4px" }}>
        {requirements.map((req, index) => (
          <div
            key={index}
            style={{
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: req.valid ? "#059669" : "#94a3b8",
              fontWeight: req.valid ? "600" : "400",
            }}
          >
            <span>{req.valid ? "✓" : "○"}</span>
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordRequirements;
