import React from "react";

// Modern dark theme colors matching App.js
const colors = {
  primary: "#6366f1",
  primaryLight: "#818cf8",
  surface: "#1e293b",
  surfaceLight: "#334155",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  divider: "#334155",
};

export default function EmailList({ emails }) {
  // 🎨 Helper: Color based on category
  const getTagStyle = (category) => {
    const base = {
      color: "white",
      borderRadius: "8px",
      padding: "4px 12px",
      fontSize: "0.75rem",
      fontWeight: 600,
      height: "fit-content",
      whiteSpace: "nowrap",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    };

    switch (category) {
      case "Newsletter":
        return { ...base, background: "#3b82f6" }; // blue
      case "Promo / Offer":
        return { ...base, background: "#16a34a" }; // green
      case "Payment / Invoice":
        return { ...base, background: "#dc2626" }; // red
      case "Personal / Work":
        return { ...base, background: "#9333ea" }; // purple
      default:
        return { ...base, background: "#6b7280" }; // gray
    }
  };

  if (!emails.length) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "3rem",
        color: colors.textSecondary,
        fontSize: "16px"
      }}>
        <div style={{ fontSize: "48px", marginBottom: "1rem" }}>📭</div>
        <p>No emails found.</p>
      </div>
    );
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {emails.map((mail) => (
        <li
          key={mail.id}
          style={{
            border: `1px solid ${colors.divider}`,
            padding: "16px",
            marginBottom: "12px",
            borderRadius: "12px",
            transition: "all 0.3s ease",
            background: colors.surfaceLight,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.surface;
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.surfaceLight;
            e.currentTarget.style.borderColor = colors.divider;
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <div style={{ flex: 1 }}>
              <b style={{ 
                fontSize: "16px", 
                color: colors.textPrimary,
                display: "block",
                marginBottom: "6px"
              }}>
                {mail.subject || "(No Subject)"}
              </b>
              <small style={{ 
                color: colors.textSecondary,
                fontSize: "14px",
                display: "block",
                marginBottom: "4px"
              }}>
                {mail.from}
              </small>
              <small style={{ 
                fontSize: "13px", 
                color: colors.textSecondary,
                opacity: 0.8
              }}>
                {mail.date}
              </small>
            </div>

            {/* 🧠 Category Tag */}
            {mail.category && (
              <span style={getTagStyle(mail.category)}>
                {mail.category}
              </span>
            )}
          </div>

          <p
            style={{
              color: colors.textSecondary,
              marginTop: "12px",
              marginBottom: 0,
              lineHeight: "1.5",
              fontSize: "14px",
            }}
          >
            {mail.snippet}
          </p>
        </li>
      ))}
    </ul>
  );
}