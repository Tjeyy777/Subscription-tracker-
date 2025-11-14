import React from "react";
import { googleLogin } from "./api";

export default function Home() {
  return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <h1>Welcome to Gmail AI Project</h1>
      <button onClick={googleLogin}>Login with Google</button>
    </div>
  );
}
