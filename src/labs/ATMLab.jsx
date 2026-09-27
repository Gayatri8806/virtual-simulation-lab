import { useState } from "react";
import OOPCGLabShell from "./oopcg/OOPCGLabShell";
import JavaConsole from "./oopcg/JavaConsole";
import VivaCheck from "./oopcg/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function ATMLab({ setPage }) {
  const [balance, setBalance] = useState(5000);
  const [amount, setAmount] = useState(1000);
  const [log, setLog] = useState([]);

  const withdraw = () => {
    let entry;
    try {
      if (amount <= 0) throw new Error("IllegalArgumentException: amount must be positive");
      if (amount > balance) throw new Error("InsufficientFundsException: insufficient balance");
      setBalance(b => b - amount);
      entry = { out: `try {\n  atm.withdraw(${amount});\n} \n>> Withdrawal successful. New balance: ₹${(balance - amount).toFixed(2)}` };
    } catch (err) {
      entry = { out: `try {\n  atm.withdraw(${amount});\n} catch (Exception e) {\n  System.out.println(e.getMessage());\n}\n>> ${err.message}`, isError: true };
    } finally {
      entry.out += `\nfinally {\n  System.out.println("Transaction attempt logged.");\n}`;
    }
    setLog(prev => [...prev, entry]);
  };

  const deposit = () => {
    if (amount <= 0) {
      setLog(prev => [...prev, { out: `try {\n  atm.deposit(${amount});\n} catch (Exception e) {\n  System.out.println(e.getMessage());\n}\n>> IllegalArgumentException: amount must be positive`, isError: true }]);
      return;
    }
    setBalance(b => b + amount);
    setLog(prev => [...prev, { out: `atm.deposit(${amount});\n>> Deposit successful. New balance: ₹${(balance + amount).toFixed(2)}` }]);
  };

  return (
    <OOPCGLabShell
      setPage={setPage}
      group="Group A &middot; OOP"
      title="ATM simulation with exception handling"
      aim="Aim: simulate an ATM's withdraw and deposit operations, using try/catch/finally to gracefully handle invalid amounts and insufficient balance instead of letting the program crash."
      controls={<>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12, color: INK_SOFT, margin: "0 0 4px" }}>Current balance</p>
            <p className="mono" style={{ fontSize: 22, fontWeight: 600, color: AMBER, margin: 0 }}>₹{balance.toFixed(2)}</p>
          </div>
        </div>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Amount</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
          <p style={{ fontSize: 11.5, color: INK_SOFT, marginTop: 6 }}>Try a negative amount, or an amount larger than the balance, to trigger the exceptions.</p>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={withdraw}>Withdraw</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={deposit}>Deposit</button>
          </div>
        </div>
      </>}
      results={<>
        <JavaConsole log={log.length ? log : [{ out: "// try a withdrawal or deposit" }]} />
        <VivaCheck
          question="What guarantees does a finally block give?"
          options={[["a", "It only runs if an exception is thrown"], ["b", "It runs every single time — whether the try block succeeded or an exception was caught — making it ideal for cleanup like logging or closing resources", ], ["c", "It replaces the need for a catch block entirely"]]}
          correctKey="b"
          explanation="finally always executes after the try/catch, regardless of whether an exception occurred — that guarantee is exactly why it's used for cleanup code (like closing a connection or, here, logging the transaction attempt) that must happen no matter what."
        />
      </>}
    />
  );
}
