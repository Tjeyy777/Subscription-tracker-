import React from "react";

// Modern dark theme colors matching App.js
const colors = {
  primary: "#6366f1",
  primaryLight: "#818cf8",
  surfaceLight: "#334155",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  divider: "#334155",
  gradient1: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

export default function ProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: colors.surfaceLight,
        padding: "16px 24px",
        borderRadius: "16px",
        border: `1px solid ${colors.divider}`,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
      }}
    >
      {/* Subtle glow effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(99,102,241,0.1) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Profile Picture with gradient border */}
      <div
        style={{
          position: "relative",
          marginRight: "20px",
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: colors.gradient1,
            borderRadius: "50%",
            padding: "3px",
            boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
          }}
        >
          <img
            src={profile.picture}
            alt="profile"
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              display: "block",
              border: "2px solid #1e293b",
            }}
          />
        </div>
      </div>

      {/* Profile Info */}
      <div style={{ flex: 1, zIndex: 1 }}>
        <h3
          style={{
            margin: 0,
            marginBottom: "4px",
            fontSize: "18px",
            fontWeight: 700,
            color: colors.textPrimary,
          }}
        >
          {profile.name}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: colors.textSecondary,
            fontWeight: 500,
          }}
        >
          {profile.email}
        </p>
      </div>

      {/* Verified badge */}
      <div
        style={{
          background: colors.gradient1,
          borderRadius: "20px",
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          zIndex: 1,
          boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
        }}
      >
        <span style={{ fontSize: "14px" }}>✓</span>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>
          Verified
        </span>
      </div>
    </div>
  );
}