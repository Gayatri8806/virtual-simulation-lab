import { useState } from "react";
import DBLabShell from "./dbms/DBLabShell";
import VivaCheck from "./dbms/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function ERDiagramLab({ setPage }) {
  const [showMapping, setShowMapping] = useState(false);

  return (
    <DBLabShell
      setPage={setPage}
      unit="assignment 1"
      title="Case study: ER diagram and relational mapping"
      aim="Aim: for a Library Management case study, design an Entity-Relationship diagram capturing entities, attributes and relationships, then convert it into a relational (table) model."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Case study: Library Management</p>
          <p style={{ fontSize: 13, color: INK_SOFT }}>Entities: Member, Book, Loan. A Member borrows many Books over time (many-to-many), tracked via a Loan record with a borrow date and return date.</p>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 14 }} onClick={() => setShowMapping(!showMapping)}>
            {showMapping ? "Hide" : "Show"} relational mapping
          </button>
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>ER diagram</p>
          <ERDiagramSVG />
        </div>
        {showMapping && (
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Mapped relational tables</p>
            <pre className="mono" style={{ fontSize: 12.5, color: AMBER, background: "#0F1D27", padding: "12px 14px", borderRadius: 8, margin: 0 }}>
{`MEMBER (member_id PK, name, email)
BOOK (book_id PK, title, author)
LOAN (loan_id PK, member_id FK -> MEMBER,
      book_id FK -> BOOK,
      borrow_date, return_date)`}
            </pre>
          </div>
        )}
        <VivaCheck
          question="Why does the many-to-many relationship between Member and Book need its own table (LOAN)?"
          options={[["a", "It's purely stylistic — a preference of the designer"], ["b", "A relational table can't directly store a many-to-many link; a junction/associative table with foreign keys to both sides is needed to represent it correctly", ], ["c", "MEMBER and BOOK could just share one combined table instead"]]}
          correctKey="b"
          explanation="Relational tables handle one-to-many relationships with a simple foreign key, but many-to-many needs an intermediate table — here LOAN — holding foreign keys to both MEMBER and BOOK, so each row represents one specific borrowing event."
        />
      </>}
    />
  );
}

function ERDiagramSVG() {
  return (
    <svg viewBox="0 0 320 200" width="100%" height="200">
      <rect width="320" height="200" fill="#0F1D27" rx="8" />
      <rect x="20" y="70" width="90" height="40" fill="none" stroke={TEAL_DARK} strokeWidth="2" />
      <text x="65" y="94" fill="#E4EFEC" fontSize="12" textAnchor="middle">MEMBER</text>
      <rect x="210" y="70" width="90" height="40" fill="none" stroke={TEAL_DARK} strokeWidth="2" />
      <text x="255" y="94" fill="#E4EFEC" fontSize="12" textAnchor="middle">BOOK</text>
      <polygon points="120,90 165,70 210,90 165,110" fill="none" stroke={AMBER} strokeWidth="2" />
      <text x="165" y="94" fill={AMBER} fontSize="10.5" textAnchor="middle">borrows</text>
      <text x="112" y="85" fill="#7C93A3" fontSize="10">M</text>
      <text x="200" y="85" fill="#7C93A3" fontSize="10">N</text>
    </svg>
  );
}
