import { Home as HomeIcon, LogIn, Info, Mail, FlaskConical, Gauge } from "lucide-react";
import { INK, AMBER } from "../constants";

export default function SideNav({ page, setPage, user }) {
  const items = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "labs", label: "Labs", icon: FlaskConical },
    { id: "about", label: "About us", icon: Info },
    { id: "contact", label: "Contact", icon: Mail },
  ];
  return (
    <nav style={{ width: 220, background: INK, padding: "22px 14px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 10px 22px" }}>
        <Gauge size={22} color={AMBER} />
        <span style={{ color: "#fff", fontFamily: "Spectral, serif", fontWeight: 600, fontSize: 16.5, lineHeight: 1.2 }}>Virtual<br />Eng. Labs</span>
      </div>
      {items.map(it => (
        <div key={it.id} className={`navlink ${page === it.id ? "active" : ""}`} onClick={() => setPage(it.id)}>
          <it.icon size={17} /> {it.label}
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div className={`navlink ${page === "login" ? "active" : ""}`} onClick={() => setPage("login")}>
        <LogIn size={17} /> {user ? user.name : "Sign in"}
      </div>
    </nav>
  );
}
