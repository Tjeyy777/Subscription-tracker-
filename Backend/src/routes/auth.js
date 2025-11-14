import express from "express";
import { initOAuth2Client, setTokens } from "./gmail.js";

const router = express.Router();

const scopes = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "openid",
];

// ✅ Step 1: Redirect user to Google OAuth
router.get("/auth/google", (req, res) => {
  const oauth2Client = initOAuth2Client();

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  });

  console.log("🔗 Redirecting to:", url);
  res.redirect(url);
});

// ✅ Step 2: Handle callback after login and save tokens
router.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;
  const oauth2Client = initOAuth2Client();

  try {
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    setTokens(tokens); // 💾 Save tokens to file

    // ✅ Redirect back to React app
    res.redirect(`${process.env.FRONTEND_URL}?auth=success`);
  } catch (err) {
    console.error("❌ Error exchanging code for tokens:", err);
    res.redirect(`${process.env.FRONTEND_URL}?auth=error`);
  }
});

export default router;
