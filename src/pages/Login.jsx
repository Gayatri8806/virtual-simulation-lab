import { useState } from "react";
import { INK_SOFT } from "../constants";

export default function Login({ setPage, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Enter your college email and password."); return; }
    if (!email.includes("@")) { setError("Enter a valid email address."); return; }
    setError("");
    setUser({ name: email.split("@")[0] });
    setPage("labs");
  };

  return (
    <div style={{ maxWidth: 380, margin: "80px auto", padding: "0 20px" }}>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 26, marginBottom: 6 }}>Sign in</h2>
      <p style={{ color: INK_SOFT, fontSize: 14, marginBottom: 26 }}>Use your college email to save your lab readings.</p>
      <form onSubmit={submit} className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>College email</label>
          <input className="field" placeholder="name@college.edu" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Password</label>
          <input className="field" type="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <p style={{ color: "#B23A2E", fontSize: 13, margin: 0 }}>{error}</p>}
        <button className="btn-primary" style={{ justifyContent: "center" }} type="submit">Sign in</button>
        <p style={{ fontSize: 12.5, color: INK_SOFT, textAlign: "center", margin: 0 }}>This demo signs you in locally &mdash; connect a real backend to store accounts.</p>
      </form>
    </div>
  );
}
