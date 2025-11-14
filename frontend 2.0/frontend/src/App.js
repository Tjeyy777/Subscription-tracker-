import React, { useEffect, useState } from "react";
import {
  googleLogin,
  fetchStatus,
  fetchProfile,
  fetchEmails,
  sendEmail,
  fetchAISummary,
} from "./api";
import ProfileCard from "./components/ProfileCard";
import EmailDashboard from "./components/EmailDashboard";
import ChatView from "./components/Chatview";

// Modern gradient color palette
const colors = {
  primary: "#6366f1",
  primaryDark: "#4f46e5",
  primaryLight: "#818cf8",
  secondary: "#10b981",
  secondaryDark: "#059669",
  accent: "#f59e0b",
  error: "#ef4444",
  background: "#0f172a",
  backgroundLight: "#1e293b",
  surface: "#1e293b",
  surfaceLight: "#334155",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  divider: "#334155",
  gradient1: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  gradient2: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  gradient3: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  gradient4: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
};

const styles = {
  appBar: {
    background: colors.gradient1,
    color: "white",
    padding: "1.5rem 2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    position: "relative",
    overflow: "hidden",
  },
  appBarGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
    background: colors.background,
    minHeight: "100vh",
  },
  card: {
    background: colors.surface,
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    padding: "2rem",
    marginBottom: "1.5rem",
    border: `1px solid ${colors.divider}`,
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute",
    top: "-50%",
    right: "-50%",
    width: "200%",
    height: "200%",
    background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  button: {
    padding: "12px 28px",
    borderRadius: "12px",
    border: "none",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    position: "relative",
    overflow: "hidden",
  },
  buttonPrimary: {
    background: colors.gradient1,
    color: "white",
  },
  buttonSecondary: {
    background: colors.gradient4,
    color: "white",
  },
  buttonOutlined: {
    background: "transparent",
    color: colors.primaryLight,
    border: `2px solid ${colors.primary}`,
    boxShadow: "0 0 20px rgba(99,102,241,0.3)",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: `2px solid ${colors.divider}`,
    borderRadius: "12px",
    fontSize: "16px",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    background: colors.backgroundLight,
    color: colors.textPrimary,
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    border: `2px solid ${colors.divider}`,
    borderRadius: "12px",
    fontSize: "16px",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "140px",
    background: colors.backgroundLight,
    color: colors.textPrimary,
  },
  tab: {
    padding: "14px 28px",
    background: "transparent",
    border: "none",
    borderBottom: "3px solid transparent",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    color: colors.textSecondary,
    position: "relative",
  },
  tabActive: {
    borderBottom: `3px solid ${colors.primary}`,
    color: colors.primaryLight,
    background: "rgba(99,102,241,0.1)",
  },
  alert: {
    padding: "16px 20px",
    borderRadius: "12px",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    animation: "slideIn 0.3s ease",
  },
  alertError: {
    background: "rgba(239,68,68,0.15)",
    color: "#fca5a5",
    border: `2px solid rgba(239,68,68,0.3)`,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 600,
    background: colors.gradient4,
    color: "white",
    boxShadow: "0 4px 12px rgba(67,233,123,0.3)",
  },
  summaryBox: {
    background: "linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(99,102,241,0.05) 100%)",
    border: `2px solid ${colors.primary}`,
    borderRadius: "16px",
    padding: "2rem",
    marginBottom: "1.5rem",
    boxShadow: "0 0 30px rgba(99,102,241,0.2)",
    position: "relative",
    overflow: "hidden",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "4rem",
  },
  welcomeCard: {
    textAlign: "center",
    padding: "5rem 2rem",
    background: colors.gradient1,
    color: "white",
  },
  glowEffect: {
    boxShadow: "0 0 40px rgba(99,102,241,0.4)",
  },
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [emails, setEmails] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [view, setView] = useState("inbox");
  const [form, setForm] = useState({ to: "", subject: "", body: "" });
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "success") {
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const status = await fetchStatus();
        if (status.authenticated) {
          setIsAuthenticated(true);
          const user = await fetchProfile();
          setProfile(user);
        }
      } catch (error) {
        console.error("Error fetching auth status:", error);
      }
    };
    init();
  }, []);

  const handleFetchEmails = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchEmails();
      const messages = data.messages || [];
      setEmails(messages);
      extractSubscriptions(messages);
      setSummary("");
    } catch (err) {
      console.error("Fetch emails error:", err);
      setError("Please log in first!");
    } finally {
      setLoading(false);
    }
  };

  const extractSubscriptions = (messages) => {
    const filtered = messages.filter((msg) =>
      /(unsubscribe|newsletter|subscription|promo|offers)/i.test(msg.snippet)
    );
    setSubscriptions(filtered);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    setError("");
    sendEmail(form)
      .then(() => {
        setForm({ to: "", subject: "", body: "" });
      })
      .catch(() => {
        setError("Failed to send email");
      });
  };

  const handleGenerateSummary = async () => {
    if (!emails.length) {
      setError("Please fetch emails first!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetchAISummary(emails);
      if (res.summary) setSummary(res.summary);
      else setError("No summary received");
    } catch (err) {
      console.error("AI summary error:", err);
      setError("Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: colors.background, minHeight: "100vh" }}>
      {/* App Bar with Glow Effect */}
      <div style={styles.appBar}>
        <div style={styles.appBarGlow} />
        <span style={{ fontSize: "32px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))", zIndex: 1 }}>📬</span>
        <h1 style={{ margin: 0, fontSize: "24px", flex: 1, fontWeight: 700, zIndex: 1, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
          Smart Gmail Dashboard
        </h1>
        {isAuthenticated && (
          <span style={{ ...styles.chip, zIndex: 1 }}>
            <span style={{ fontSize: "16px" }}>✓</span>
            <span>Authenticated</span>
          </span>
        )}
      </div>

      <div style={styles.container}>
        {error && (
          <div style={{ ...styles.alert, ...styles.alertError }}>
            <span style={{ fontSize: "20px" }}>⚠️</span>
            <span style={{ flex: 1 }}>{error}</span>
            <button
              onClick={() => setError("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "22px",
                color: "#fca5a5",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.2)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              ×
            </button>
          </div>
        )}

        {isAuthenticated ? (
          <>
            {/* Profile Card with Glow */}
            {profile && (
              <div style={{ ...styles.card, ...styles.glowEffect }}>
                <div style={styles.cardGlow} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <ProfileCard profile={profile} />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
              <button
                onClick={googleLogin}
                style={{ ...styles.button, ...styles.buttonOutlined }}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(99,102,241,0.1)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                🔄 Re-login
              </button>
              <button
                onClick={handleFetchEmails}
                disabled={loading}
                style={{
                  ...styles.button,
                  ...styles.buttonPrimary,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseOver={(e) =>
                  !loading && (e.target.style.transform = "translateY(-2px)")
                }
                onMouseOut={(e) =>
                  !loading && (e.target.style.transform = "translateY(0)")
                }
              >
                📥 Fetch Emails
              </button>
            </div>

            {/* Modern Tabs */}
            <div
              style={{
                ...styles.card,
                padding: 0,
                display: "flex",
                marginBottom: "2rem",
              }}
            >
              <button
                style={{
                  ...styles.tab,
                  ...(view === "inbox" ? styles.tabActive : {}),
                  flex: 1,
                }}
                onClick={() => setView("inbox")}
              >
                <span style={{ fontSize: "18px", marginRight: "8px" }}>📥</span>
                Inbox
              </button>
              <button
                style={{
                  ...styles.tab,
                  ...(view === "subscriptions" ? styles.tabActive : {}),
                  flex: 1,
                }}
                onClick={() => setView("subscriptions")}
              >
                <span style={{ fontSize: "18px", marginRight: "8px" }}>🔔</span>
                Subscriptions
              </button>
              <button
                style={{
                  ...styles.tab,
                  ...(view === "chat" ? styles.tabActive : {}),
                  flex: 1,
                }}
                onClick={() => setView("chat")}
              >
                <span style={{ fontSize: "18px", marginRight: "8px" }}>💬</span>
                Chat View
              </button>
            </div>

            {/* AI Summary Button with Glow */}
            {view === "inbox" && (
              <div style={{ marginBottom: "1.5rem" }}>
                <button
                  onClick={handleGenerateSummary}
                  disabled={loading || !emails.length}
                  style={{
                    ...styles.button,
                    ...styles.buttonSecondary,
                    opacity: loading || !emails.length ? 0.6 : 1,
                    cursor: loading || !emails.length ? "not-allowed" : "pointer",
                  }}
                  onMouseOver={(e) =>
                    !loading &&
                    emails.length &&
                    (e.target.style.transform = "translateY(-2px)")
                  }
                  onMouseOut={(e) =>
                    !loading &&
                    emails.length &&
                    (e.target.style.transform = "translateY(0)")
                  }
                >
                  🧠 Generate AI Summary
                </button>
              </div>
            )}

            {/* Enhanced Summary Section */}
            {summary && view === "inbox" && (
              <div style={styles.summaryBox}>
                <h3 style={{ margin: "0 0 1rem 0", color: colors.primaryLight, fontSize: "20px", fontWeight: 700 }}>
                  ✨ AI Summary
                </h3>
                <p style={{ margin: 0, lineHeight: 1.7, color: colors.textPrimary, fontSize: "16px" }}>{summary}</p>
              </div>
            )}

            {/* Chat View */}
            {view === "chat" && (
              <div style={styles.card}>
                <div style={styles.cardGlow} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <ChatView emails={emails} />
                </div>
              </div>
            )}

            {/* Compose Email Card */}
            {view !== "chat" && (
              <div style={styles.card}>
                <div style={styles.cardGlow} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h2 style={{ marginTop: 0, color: colors.textPrimary, fontSize: "22px", fontWeight: 700, marginBottom: "1.5rem" }}>
                    ✉️ Compose Email
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                    <input
                      style={styles.input}
                      placeholder="Recipient Email"
                      value={form.to}
                      onChange={(e) => setForm({ ...form, to: e.target.value })}
                      required
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.primary;
                        e.target.style.boxShadow = `0 0 0 3px rgba(99,102,241,0.1)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.divider;
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <input
                      style={styles.input}
                      placeholder="Subject"
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      required
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.primary;
                        e.target.style.boxShadow = `0 0 0 3px rgba(99,102,241,0.1)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.divider;
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <textarea
                      style={styles.textarea}
                      placeholder="Message body..."
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      required
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.primary;
                        e.target.style.boxShadow = `0 0 0 3px rgba(99,102,241,0.1)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.divider;
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      onClick={handleSendEmail}
                      style={{ ...styles.button, ...styles.buttonPrimary, alignSelf: "flex-start" }}
                      onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
                      onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
                    >
                      📤 Send Email
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Email Dashboard */}
            {(view === "inbox" || view === "subscriptions") && (
              <div style={styles.card}>
                <div style={styles.cardGlow} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h2 style={{ marginTop: 0, color: colors.textPrimary, fontSize: "22px", fontWeight: 700, marginBottom: "1.5rem" }}>
                    {view === "inbox"
                      ? "📥 AI-Categorized Inbox"
                      : "🔔 Subscription Center"}
                  </h2>

                  {loading ? (
                    <div style={styles.loader}>
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
                  ) : (
                    <EmailDashboard
                      emails={view === "inbox" ? emails : subscriptions}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ ...styles.card, ...styles.welcomeCard }}>
            <div style={{ fontSize: "80px", marginBottom: "1.5rem", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}>📬</div>
            <h2 style={{ fontSize: "32px", marginBottom: "1rem", fontWeight: 700 }}>
              Welcome to Smart Gmail Dashboard
            </h2>
            <p style={{ fontSize: "18px", marginBottom: "2.5rem", opacity: 0.9 }}>
              Connect your Google account to unlock AI-powered email management
            </p>
            <button
              onClick={googleLogin}
              style={{ ...styles.button, fontSize: "16px", padding: "16px 40px" }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-3px) scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
              }}
            >
              🔐 Login with Google
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        * {
          box-sizing: border-box;
        }
        
        input:focus, textarea:focus {
          outline: none;
        }
        
        button {
          font-family: inherit;
        }
        
        ::placeholder {
          color: #64748b;
        }
      `}</style>
    </div>
  );
}

export default App;