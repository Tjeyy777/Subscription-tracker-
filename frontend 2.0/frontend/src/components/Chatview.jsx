import React, { useEffect, useState } from "react";
import { fetchConversations, fetchSmartReplies } from "../api";

// Modern dark theme colors matching App.js
const colors = {
  primary: "#6366f1",
  primaryLight: "#818cf8",
  secondary: "#10b981",
  background: "#0f172a",
  backgroundLight: "#1e293b",
  surface: "#1e293b",
  surfaceLight: "#334155",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  divider: "#334155",
  gradient1: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  gradient4: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
};

export default function ChatView() {
  const [conversations, setConversations] = useState({});
  const [selectedSender, setSelectedSender] = useState(null);
  const [smartReplies, setSmartReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchConversations();
        setConversations(data.conversations || {});
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelectSender = (sender) => {
    setSelectedSender(sender);
    setSmartReplies([]);
  };

  const handleGenerateSmartReplies = async (email) => {
    setLoadingReplies(true);
    try {
      const replies = await fetchSmartReplies({
        subject: email.subject,
        snippet: email.snippet,
      });
      setSmartReplies(replies.replies || []);
    } catch (err) {
      console.error("Failed to generate smart replies:", err);
    } finally {
      setLoadingReplies(false);
    }
  };

  const senderList = Object.keys(conversations);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: `4px solid ${colors.divider}`,
            borderTop: `4px solid ${colors.primary}`,
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <h2
        style={{
          marginTop: 0,
          marginBottom: "1.5rem",
          color: colors.textPrimary,
          fontSize: "22px",
          fontWeight: 700,
        }}
      >
        💬 Conversation View
      </h2>

      <div
        style={{
          display: "flex",
          height: "70vh",
          border: `1px solid ${colors.divider}`,
          borderRadius: "12px",
          overflow: "hidden",
          background: colors.backgroundLight,
        }}
      >
        {/* 📜 Sender List */}
        <div
          style={{
            width: "30%",
            borderRight: `2px solid ${colors.divider}`,
            overflowY: "auto",
            background: colors.surface,
          }}
        >
          {senderList.length === 0 ? (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: colors.textSecondary,
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "1rem" }}>📭</div>
              <p>No conversations found</p>
            </div>
          ) : (
            senderList.map((sender) => (
              <div
                key={sender}
                onClick={() => handleSelectSender(sender)}
                style={{
                  padding: "16px",
                  cursor: "pointer",
                  background:
                    selectedSender === sender
                      ? "rgba(99,102,241,0.15)"
                      : "transparent",
                  borderBottom: `1px solid ${colors.divider}`,
                  borderLeft:
                    selectedSender === sender
                      ? `4px solid ${colors.primary}`
                      : "4px solid transparent",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (selectedSender !== sender) {
                    e.currentTarget.style.background = colors.surfaceLight;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSender !== sender) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <strong
                  style={{
                    color: colors.textPrimary,
                    fontSize: "15px",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  {sender}
                </strong>
                <p
                  style={{
                    fontSize: "13px",
                    color: colors.textSecondary,
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {conversations[sender][0]?.subject || "No subject"}
                </p>
                <span
                  style={{
                    fontSize: "11px",
                    color: colors.textSecondary,
                    opacity: 0.7,
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {conversations[sender].length} message
                  {conversations[sender].length > 1 ? "s" : ""}
                </span>
              </div>
            ))
          )}
        </div>

        {/* 💬 Chat View */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: colors.backgroundLight,
          }}
        >
          {selectedSender ? (
            <>
              {/* Chat Header */}
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `2px solid ${colors.divider}`,
                  background: colors.surface,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: colors.textPrimary,
                    fontSize: "18px",
                    fontWeight: 600,
                  }}
                >
                  {selectedSender}
                </h3>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "13px",
                    color: colors.textSecondary,
                  }}
                >
                  {conversations[selectedSender].length} messages in thread
                </p>
              </div>

              {/* Messages Container */}
              <div
                style={{
                  flex: 1,
                  padding: "20px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {conversations[selectedSender].map((email) => (
                  <div
                    key={email.id}
                    onClick={() => handleGenerateSmartReplies(email)}
                    style={{
                      background: colors.surfaceLight,
                      padding: "14px 16px",
                      borderRadius: "12px",
                      maxWidth: "80%",
                      alignSelf: "flex-start",
                      cursor: "pointer",
                      border: `1px solid ${colors.divider}`,
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.surface;
                      e.currentTarget.style.borderColor = colors.primary;
                      e.currentTarget.style.transform = "translateX(4px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(99,102,241,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = colors.surfaceLight;
                      e.currentTarget.style.borderColor = colors.divider;
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0,0,0,0.2)";
                    }}
                  >
                    <strong
                      style={{
                        color: colors.textPrimary,
                        fontSize: "15px",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      {email.subject || "(No Subject)"}
                    </strong>
                    <p
                      style={{
                        margin: "6px 0",
                        color: colors.textSecondary,
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {email.snippet}
                    </p>
                    <span
                      style={{
                        fontSize: "12px",
                        color: colors.textSecondary,
                        opacity: 0.7,
                      }}
                    >
                      {email.date}
                    </span>
                  </div>
                ))}
              </div>

              {/* ⚙️ Smart Replies Section */}
              {(smartReplies.length > 0 || loadingReplies) && (
                <div
                  style={{
                    padding: "16px 20px",
                    borderTop: `2px solid ${colors.divider}`,
                    background: colors.surface,
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: colors.primaryLight,
                    }}
                  >
                    💡 Smart Replies
                  </p>
                  {loadingReplies ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        color: colors.textSecondary,
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          border: `3px solid ${colors.divider}`,
                          borderTop: `3px solid ${colors.primary}`,
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      <span style={{ fontSize: "14px" }}>
                        Generating replies...
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {smartReplies.map((reply, i) => (
                        <button
                          key={i}
                          style={{
                            background: colors.gradient4,
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 16px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 600,
                            transition: "all 0.3s ease",
                            boxShadow: "0 2px 8px rgba(67,233,123,0.3)",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow =
                              "0 4px 12px rgba(67,233,123,0.4)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow =
                              "0 2px 8px rgba(67,233,123,0.3)";
                          }}
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: colors.textSecondary,
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "1rem" }}>💬</div>
              <p style={{ fontSize: "16px" }}>
                Select a conversation to view messages
              </p>
              <p style={{ fontSize: "14px", opacity: 0.7 }}>
                Click on any sender from the left panel
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}