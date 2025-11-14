import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔮 Simple categorization prompt
export async function categorizeEmail(email) {
  const prompt = `
You are an AI that classifies Gmail emails into categories.
Categories: Newsletter, Offer, Invoice, Personal, Work.

Email:
Subject: ${email.subject}
Snippet: ${email.snippet}

Return ONLY one of these categories.
`;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return res.choices[0].message.content.trim();
  } catch (err) {
    console.error("AI Error:", err.message);
    return "Uncategorized";
  }
}
