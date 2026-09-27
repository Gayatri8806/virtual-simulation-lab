import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { INK_SOFT, TEAL_DARK } from "../constants";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Fill in every field before sending."); return;
    }
    setError(""); setSent(true);
  };

  if (sent) {
    return (
      <div style={{ maxWidth: 420, margin: "90px auto", textAlign: "center" }}>
        <CheckCircle2 size={34} color={TEAL_DARK} />
        <h3 style={{ fontFamily: "Spectral, serif", fontSize: 22, margin: "14px 0 6px" }}>Message received</h3>
        <p style={{ color: INK_SOFT, fontSize: 14.5 }}>We'll reply to {form.email} shortly.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 440, margin: "70px auto", padding: "0 20px" }}>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 26, marginBottom: 6 }}>Contact us</h2>
      <p style={{ color: INK_SOFT, fontSize: 14, marginBottom: 24 }}>Found a bug in a simulation, or want a subject prioritised? Tell us.</p>
      <form onSubmit={submit} className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input className="field" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="field" placeholder="name@college.edu" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <textarea className="field" rows={4} placeholder="What's on your mind?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
        {error && <p style={{ color: "#B23A2E", fontSize: 13, margin: 0 }}>{error}</p>}
        <button className="btn-primary" style={{ justifyContent: "center" }} type="submit">Send message</button>
      </form>
    </div>
  );
}
