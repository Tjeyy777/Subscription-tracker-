import React, { useState, useMemo } from "react";
import { fetchSmartReplies } from "../api";

// Modern dark theme colors matching App.js
const colors = {
  primary: "#6366f1",
  primaryDark: "#4f46e5",
  primaryLight: "#818cf8",
  secondary: "#10b981",
  background: "#0f172a",
  backgroundLight: "#1e293b",
  surface: "#1e293b",
  surfaceLight: "#334155",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  divider: "#334155",
};

export default function EmailDashboard({ emails }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [smartReplies, setSmartReplies] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  // 🧮 Compute category counts
  const counts = useMemo(() => {
    const c = { All: emails.length };
    emails.forEach((mail) => {
      const cat = mail.category || "Uncategorized";
      c[cat] = (c[cat] || 0) + 1;
    });
    return c;
  }, [emails]);

  // 🎯 Filter emails based on selected category
  const filteredEmails =
    selectedCategory === "All"
      ? emails
      : emails.filter((mail) => mail.category === selectedCategory);

  const categories = Object.keys(counts);

  // 💬 Generate smart replies for a given email
  const handleSmartReply = async (email) => {
    try {
      setLoadingId(email.id);
      const res = await fetchSmartReplies({
        subject: email.subject,
        snippet: email.snippet,
      });
      setSmartReplies((prev) => ({ ...prev, [email.id]: res.replies }));
    } catch (err) {
      alert("❌ Failed to generate smart replies");
    } finally {
      setLoadingId(null);
    }
  };

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
    <div>
      {/* 📊 Category Filter Buttons */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: selectedCategory === cat
                ? `2px solid ${colors.primary}`
                : `2px solid ${colors.divider}`,
              background: selectedCategory === cat 
                ? colors.primary 
                : colors.surfaceLight,
              color: selectedCategory === cat ? "white" : colors.textPrimary,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              transition: "all 0.3s ease",
              boxShadow: selectedCategory === cat 
                ? "0 4px 12px rgba(99,102,241,0.4)" 
                : "none",
            }}
            onMouseOver={(e) => {
              if (selectedCategory !== cat) {
                e.target.style.background = colors.surface;
                e.target.style.borderColor = colors.primary;
              }
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              if (selectedCategory !== cat) {
                e.target.style.background = colors.surfaceLight;
                e.target.style.borderColor = colors.divider;
              }
              e.target.style.transform = "translateY(0)";
            }}
          >
            {cat} ({counts[cat]})
          </button>
        ))}
      </div>

      {/* 📬 Email List */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {filteredEmails.map((mail) => (
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
                marginBottom: "10px",
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
                marginTop: "10px",
                marginBottom: "12px",
                lineHeight: "1.5",
                fontSize: "14px",
              }}
            >
              {mail.snippet}
            </p>

            <button
              onClick={() => handleSmartReply(mail)}
              disabled={loadingId === mail.id}
              style={{
                background: loadingId === mail.id 
                  ? colors.divider 
                  : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                cursor: loadingId === mail.id ? "not-allowed" : "pointer",
                marginTop: "8px",
                fontWeight: 600,
                fontSize: "13px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
                opacity: loadingId === mail.id ? 0.6 : 1,
              }}
              onMouseOver={(e) => {
                if (loadingId !== mail.id) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(16,185,129,0.4)";
                }
              }}
              onMouseOut={(e) => {
                if (loadingId !== mail.id) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 8px rgba(16,185,129,0.3)";
                }
              }}
            >
              {loadingId === mail.id ? "⏳ Generating..." : "💬 Smart Reply"}
            </button>

            {smartReplies[mail.id]?.length > 0 && (
              <ul
                style={{
                  background: "rgba(99,102,241,0.1)",
                  marginTop: "12px",
                  padding: "14px",
                  borderRadius: "10px",
                  listStyle: "none",
                  border: `1px solid ${colors.primary}`,
                  boxShadow: "0 0 20px rgba(99,102,241,0.2)",
                }}
              >
                {smartReplies[mail.id].map((reply, i) => (
                  <li 
                    key={i} 
                    style={{ 
                      marginBottom: i < smartReplies[mail.id].length - 1 ? "10px" : "0",
                      color: colors.textPrimary,
                      fontSize: "14px",
                      lineHeight: "1.5",
                      paddingLeft: "8px",
                      borderLeft: `3px solid ${colors.primary}`,
                    }}
                  >
                    💡 {reply}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}