import express from "express";
import { google } from "googleapis";
import fs from "fs";
import OpenAI from "openai";

const router = express.Router();
const TOKEN_PATH = "./config/tokens.json"; // 🧠 tokens stored safely here
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let oauth2Client;

// ✅ Initialize OAuth2 client + auto load saved tokens
export const initOAuth2Client = () => {
  if (!oauth2Client) {
    oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  // 🔄 Always check if tokens exist and load them into the client
  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
    oauth2Client.setCredentials(tokens);
    console.log("✅ Tokens loaded from tokens.json — authenticated.");
  } else {
    console.log("⚠️ No saved tokens found. Login required.");
  }

  return oauth2Client;
};

// ✅ Save and refresh tokens automatically
export const setTokens = (tokens) => {
  if (!oauth2Client) {
    console.error("❌ OAuth2 client not initialized before saving tokens");
    return;
  }

  oauth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log("💾 Tokens saved to tokens.json");

  // ♻️ Auto-refresh tokens if they change
  oauth2Client.on("tokens", (newTokens) => {
    if (newTokens.refresh_token || newTokens.access_token) {
      const updated = { ...tokens, ...newTokens };
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(updated, null, 2));
      console.log("🔁 Tokens refreshed and saved automatically.");
    }
  });
};



// ✅ Summarize all categorized emails using GPT
router.post("/summary", async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails || !emails.length) {
      return res.status(400).json({ error: "No emails provided" });
    }

    const prompt = `
You are an AI analyst summarizing Gmail data. 
You will receive a list of emails with fields: subject, from, category, and date.

Summarize this data in a friendly, insightful way.
Example response:
"🧾 You received 8 invoices and 5 offers this week. Most invoices are from Razorpay and Swiggy. 
Your newsletters are mainly from Product Hunt and Medium. Overall, 18 new emails."

Now summarize the following emails:

${emails
  .map(
    (e) =>
      `• [${e.category}] ${e.subject} — from ${e.from || "unknown"}`
  )
  .join("\n")}
`;

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ summary: result.choices[0].message.content });
  } catch (error) {
    console.error("❌ Error generating summary:", error.message);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

// ✅ Check auth status
router.get("/status", (req, res) => {
  if (oauth2Client && oauth2Client.credentials?.access_token) {
    return res.json({ authenticated: true });
  }
  res.json({ authenticated: false });
});


// 🧠 Helper: Categorize each email using OpenAI
async function categorizeEmail(email) {
  const prompt = `
You are an AI that classifies Gmail emails into categories.
Categories: Newsletter, Offer, Invoice, Work, Personal.

Email:
Subject: ${email.subject}
Snippet: ${email.snippet}

Return ONLY one of these categories.
`;

  try {
    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    return result.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI categorization error:", error.message);
    return "Uncategorized";
  }
}


// ✅ Fetch Gmail messages + AI Categorization
router.get("/list", async (req, res) => {
  try {
    if (!oauth2Client || !oauth2Client.credentials?.access_token) {
      return res
        .status(401)
        .send("❌ Not authenticated. Please log in first at /gmail/auth/google");
    }

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const result = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = result.data.messages || [];

    const detailedMessages = await Promise.all(
      messages.map(async (msg) => {
        const details = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
          format: "metadata",
          metadataHeaders: ["Subject", "From", "Date"],
        });

        const headers = details.data.payload.headers;
        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const from = headers.find((h) => h.name === "From")?.value || "";
        const date = headers.find((h) => h.name === "Date")?.value || "";
        const snippet = details.data.snippet || "";

        // 🧠 AI Categorization
        const category = await categorizeEmail({ subject, snippet });

        return { id: msg.id, subject, from, date, snippet, category };
      })
    );

    res.json({ messages: detailedMessages });
  } catch (err) {
    console.error("❌ Error fetching Gmail messages:", err);
    res.status(500).send("Failed to fetch Gmail messages");
  }
});


// ✅ Generate AI Smart Reply for a specific email
router.post("/smart-reply", async (req, res) => {
  try {
    const { subject, snippet } = req.body;

    if (!subject && !snippet) {
      return res.status(400).json({ error: "Missing email content" });
    }

    const prompt = `
You are a helpful email assistant. 
Generate 3 short, natural reply suggestions to the following email. 
Each reply should be on a new line, friendly and relevant.

Email:
Subject: ${subject}
Content: ${snippet}

Example format:
1. Thanks for the update! Really appreciate it.
2. Got it, I’ll review and get back to you soon.
3. Sounds good! Let’s move ahead.
`;

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    // Split response into multiple lines
    const rawText = result.choices[0].message.content;
    const replies = rawText.split(/\d\.\s/).filter(Boolean).map(r => r.trim());

    res.json({ replies });
  } catch (error) {
    console.error("❌ Smart Reply Error:", error);
    res.status(500).json({ error: "Failed to generate smart replies" });
  }
});


// ✅ Get Gmail Profile Info (User Email + Name)
router.get("/profile", async (req, res) => {
  try {
    if (!oauth2Client || !oauth2Client.credentials) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const userInfo = await oauth2.userinfo.get();
    res.json({
      email: userInfo.data.email,
      name: userInfo.data.name,
      picture: userInfo.data.picture,
    });
  } catch (err) {
    console.error("❌ Error fetching user profile:", err);
    res.status(500).json({ error: "Failed to get profile info" });
  }
});


// ✅ Send Email
router.post("/send", async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const message = [`To: ${to}`, `Subject: ${subject}`, "", body].join("\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    res.json({ success: true, message: "✅ Email sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).send("Failed to send email");
  }
});

console.log("📡 Gmail routes loaded successfully!");



// ✅ New: Conversational view - group emails by sender
router.get("/conversations", async (req, res) => {
  try {
    if (!oauth2Client || !oauth2Client.credentials?.access_token) {
      return res.status(401).send("Not authenticated");
    }

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const result = await gmail.users.messages.list({
      userId: "me",
      maxResults: 30,
    });

    const messages = result.data.messages || [];

    const detailedMessages = await Promise.all(
      messages.map(async (msg) => {
        const details = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
          format: "metadata",
          metadataHeaders: ["Subject", "From", "Date"],
        });

        const headers = details.data.payload.headers;
        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const from = headers.find((h) => h.name === "From")?.value || "";
        const date = headers.find((h) => h.name === "Date")?.value || "";
        const snippet = details.data.snippet || "";

        return { id: msg.id, from, subject, snippet, date };
      })
    );

    // 🧠 Group by sender
    const grouped = detailedMessages.reduce((acc, mail) => {
      const sender = mail.from || "Unknown";
      if (!acc[sender]) acc[sender] = [];
      acc[sender].push(mail);
      return acc;
    }, {});

    res.json({ conversations: grouped });
  } catch (err) {
    console.error("❌ Error fetching conversations:", err);
    res.status(500).send("Failed to fetch conversations");
  }
});


export default router;
