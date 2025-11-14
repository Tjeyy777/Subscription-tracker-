import React, { useEffect, useState } from "react";
import { fetchEmails } from "./api";

export default function Dashboard() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const getEmails = async () => {
      const data = await fetchEmails();
      setEmails(data.messages);
    };
    getEmails();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📩 Your Gmail Inbox</h2>
      <ul>
        {emails.map((mail) => (
          <li key={mail.id}>
            <strong>{mail.subject}</strong> — {mail.from} ({mail.date})
          </li>
        ))}
      </ul>
      <a href="/">⬅️ Back to Home</a>
    </div>
  );
}
