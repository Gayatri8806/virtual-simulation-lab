import { useState } from "react";
import DBLabShell from "./dbms/DBLabShell";
import SqlConsole from "./dbms/SqlConsole";
import VivaCheck from "./dbms/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function TransactionsLab({ setPage }) {
  const [accounts, setAccounts] = useState({ A: 5000, B: 2000 });
  const [pending, setPending] = useState(null);
  const [amount, setAmount] = useState(1000);
  const [log, setLog] = useState([]);

  const beginTransfer = () => {
    if (amount > accounts.A) {
      setLog(prev => [...prev, { code: `BEGIN TRANSACTION;\nUPDATE ACCOUNT SET balance = balance - ${amount} WHERE id='A';`, text: "Error: insufficient funds in account A. Transaction will be rolled back.", isError: true }]);
      setPending(null);
      return;
    }
    setPending({ A: accounts.A - amount, B: accounts.B + amount });
    setLog(prev => [...prev, {
      code: `BEGIN TRANSACTION;\nUPDATE ACCOUNT SET balance = balance - ${amount} WHERE id='A';\nUPDATE ACCOUNT SET balance = balance + ${amount} WHERE id='B';`,
      text: `Transaction started (uncommitted).\nA would become ${accounts.A - amount}, B would become ${accounts.B + amount}.\nCall COMMIT or ROLLBACK to finish.`,
    }]);
  };

  const commit = () => {
    if (!pending) return;
    setAccounts(pending);
    setLog(prev => [...prev, { code: "COMMIT;", text: `Transaction committed. A=${pending.A}, B=${pending.B}` }]);
    setPending(null);
  };

  const rollback = () => {
    if (!pending) return;
    setLog(prev => [...prev, { code: "ROLLBACK;", text: `Transaction rolled back. Accounts unchanged: A=${accounts.A}, B=${accounts.B}` }]);
    setPending(null);
  };

  return (
    <DBLabShell
      setPage={setPage}
      unit="assignment 7"
      title="Transactions: ACID properties, COMMIT and ROLLBACK"
      aim="Aim: transfer money between two accounts inside a transaction, and see how COMMIT makes the change permanent while ROLLBACK undoes everything — demonstrating atomicity."
      controls={<>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12, color: INK_SOFT, margin: "0 0 4px" }}>Account A</p>
            <p className="mono" style={{ fontSize: 18, fontWeight: 600, color: AMBER, margin: 0 }}>₹{accounts.A}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12, color: INK_SOFT, margin: "0 0 4px" }}>Account B</p>
            <p className="mono" style={{ fontSize: 18, fontWeight: 600, color: AMBER, margin: 0 }}>₹{accounts.B}</p>
          </div>
        </div>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Transfer amount (A &rarr; B)</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} disabled={!!pending} />
          <button className="btn-primary" style={{ width: "100%", marginTop: 12 }} onClick={beginTransfer} disabled={!!pending}>BEGIN TRANSACTION</button>
          {pending && (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button className="btn-primary" style={{ flex: 1, background: TEAL_DARK }} onClick={commit}>COMMIT</button>
              <button className="btn-outline" style={{ flex: 1 }} onClick={rollback}>ROLLBACK</button>
            </div>
          )}
        </div>
      </>}
      results={<>
        <SqlConsole log={log.length ? log : [{ code: "-- begin a transfer, then choose commit or rollback", text: null }]} />
        <VivaCheck
          question="Which ACID property specifically guarantees that a transaction is 'all or nothing'?"
          options={[["a", "Consistency"], ["b", "Atomicity"], ["c", "Isolation"]]}
          correctKey="b"
          explanation="Atomicity guarantees that either every operation in a transaction succeeds and is committed, or none of them take effect at all — exactly what ROLLBACK demonstrates by undoing both the debit and credit together."
        />
      </>}
    />
  );
}
