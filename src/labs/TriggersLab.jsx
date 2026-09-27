import { useState, useRef } from "react";
import DBLabShell from "./dbms/DBLabShell";
import SqlConsole from "./dbms/SqlConsole";
import VivaCheck from "./dbms/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function TriggersLab({ setPage }) {
  const [products, setProducts] = useState([{ id: 1, name: "Widget", stock: 50 }]);
  const [auditLog, setAuditLog] = useState([]);
  const [log, setLog] = useState([]);
  const idRef = useRef(2);

  const insertProduct = () => {
    const newProduct = { id: idRef.current++, name: `Item${idRef.current}`, stock: 20 };
    setProducts(prev => [...prev, newProduct]);
    const auditEntry = `[TRIGGER FIRED] AFTER INSERT on PRODUCT: logged new product id=${newProduct.id}`;
    setAuditLog(prev => [...prev, auditEntry]);
    setLog(prev => [...prev, {
      code: `INSERT INTO PRODUCT (name, stock) VALUES ('${newProduct.name}', ${newProduct.stock});`,
      text: `1 row inserted.\n${auditEntry}`,
    }]);
  };

  const updateStock = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock - 10) } : p));
    const product = products.find(p => p.id === id);
    const newStock = Math.max(0, product.stock - 10);
    let auditEntry = `[TRIGGER FIRED] AFTER UPDATE on PRODUCT: stock changed for id=${id} (${product.stock} -> ${newStock})`;
    let lowStockWarning = "";
    if (newStock < 15) {
      lowStockWarning = `\n[TRIGGER FIRED] low_stock_alert: id=${id} stock (${newStock}) below threshold (15)!`;
    }
    setAuditLog(prev => [...prev, auditEntry + lowStockWarning]);
    setLog(prev => [...prev, {
      code: `UPDATE PRODUCT SET stock = stock - 10 WHERE id = ${id};`,
      text: `1 row updated.\n${auditEntry}${lowStockWarning}`,
      isError: !!lowStockWarning,
    }]);
  };

  return (
    <DBLabShell
      setPage={setPage}
      unit="assignment 6"
      title="Triggers: automatic actions on INSERT and UPDATE"
      aim="Aim: define AFTER INSERT and AFTER UPDATE triggers on a PRODUCT table — one that logs every change to an audit table, and one that raises an alert automatically when stock falls below a threshold."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Triggers defined</p>
          <pre className="mono" style={{ fontSize: 11, color: INK_SOFT, background: "#0F1D27", padding: "10px 12px", borderRadius: 6, margin: 0 }}>
{`AFTER INSERT ON PRODUCT -> log_audit
AFTER UPDATE ON PRODUCT -> log_audit,
  low_stock_alert (IF stock < 15)`}
          </pre>
          <button className="btn-primary" style={{ width: "100%", marginTop: 14 }} onClick={insertProduct}>INSERT a new product</button>
        </div>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Products (click to sell 10 units)</p>
          {products.map(p => (
            <button key={p.id} className="btn-outline" style={{ width: "100%", marginBottom: 6, textAlign: "left" }} onClick={() => updateStock(p.id)}>
              #{p.id} {p.name} — stock: {p.stock}
            </button>
          ))}
        </div>
      </>}
      results={<>
        <SqlConsole log={log.length ? log : [{ code: "-- insert a product or update stock to fire the triggers", text: null }]} />
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Audit log (populated only by triggers)</p>
          {auditLog.length === 0 ? <p style={{ fontSize: 12.5, color: INK_SOFT }}>No trigger events yet.</p> : (
            <div className="mono" style={{ fontSize: 11.5, color: TEAL_DARK, display: "flex", flexDirection: "column", gap: 4 }}>
              {auditLog.map((a, i) => <div key={i} style={{ whiteSpace: "pre-wrap" }}>{a}</div>)}
            </div>
          )}
        </div>
        <VivaCheck
          question="Why is a trigger useful for the low-stock alert instead of relying on application code to check after every sale?"
          options={[["a", "Triggers run faster than any application code, always"], ["b", "A trigger fires automatically at the database level for EVERY update to the table, no matter which application or script made the change — so the rule can never accidentally be skipped", ], ["c", "Triggers replace the need for any application code entirely"]]}
          correctKey="b"
          explanation="If the low-stock check lived only in one application's code, a different script or a direct database update could bypass it entirely. A trigger is enforced by the database itself on every UPDATE to PRODUCT, regardless of what triggered the change."
        />
      </>}
    />
  );
}
