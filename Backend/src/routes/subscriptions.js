import express from "express";
import { google } from "googleapis";
import { initOAuth2Client } from "./gmail.js";

const router = express.Router();

router.get("/subscriptions", async (req, res) => {
  try {
    const oauth2Client = initOAuth2Client();

    if (!oauth2Client || !oauth2Client.credentials?.access_token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const result = await gmail.users.messages.list({
      userId: "me",
      q: "unsubscribe OR renewal OR subscription OR billing OR trial",
      maxResults: 50,
    });

    const messages = result.data.messages || [];
    const subs = [];

    for (const msg of messages) {
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

      if (
        /unsubscribe|subscription|renewal|billing|trial/i.test(subject) ||
        /unsubscribe/i.test(details.data.snippet)
      ) {
        subs.push({ id: msg.id, subject, from, date });
      }
    }

    res.json({ subscriptions: subs });
  } catch (err) {
    console.error("❌ Error fetching subscriptions:", err);
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
});

export default router;
