import { useState } from "react";
import OOPCGLabShell from "./oopcg/OOPCGLabShell";
import JavaConsole from "./oopcg/JavaConsole";
import VivaCheck from "./oopcg/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function ECommerceLab({ setPage }) {
  const [price, setPrice] = useState(1200);
  const [qty, setQty] = useState(3);
  const [useCoupon, setUseCoupon] = useState(false);
  const [couponPct, setCouponPct] = useState(10);
  const [log, setLog] = useState([]);

  const placeOrder = () => {
    const subtotal = price * qty;
    let discount = qty >= 5 ? subtotal * 0.15 : qty >= 3 ? subtotal * 0.05 : 0;
    let discountLabel = qty >= 5 ? "bulk discount (15%, qty≥5)" : qty >= 3 ? "bulk discount (5%, qty≥3)" : "no bulk discount";
    let couponDiscount = 0;
    if (useCoupon) {
      couponDiscount = (subtotal - discount) * (couponPct / 100);
    }
    const total = subtotal - discount - couponDiscount;
    const constructorUsed = useCoupon
      ? "new Order(price, qty, couponCode)  // overloaded constructor"
      : "new Order(price, qty)  // base constructor";

    setLog(prev => [...prev, {
      out: `${constructorUsed}\nSubtotal: ₹${subtotal.toFixed(2)}\n${discountLabel}: -₹${discount.toFixed(2)}${useCoupon ? `\nCoupon (${couponPct}%): -₹${couponDiscount.toFixed(2)}` : ""}\nTotal: ₹${total.toFixed(2)}`,
    }]);
  };

  return (
    <OOPCGLabShell
      setPage={setPage}
      group="Group A &middot; OOP"
      title="E-commerce order processing with overloaded constructors"
      aim="Aim: model an Order class with multiple overloaded constructors — one for a plain order, another that also accepts a coupon code — applying quantity-based bulk discounts and an optional coupon discount to generate an invoice."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Unit price (₹)</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 12 }}>Quantity</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={qty} onChange={e => setQty(Number(e.target.value))} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 13, fontWeight: 600 }}>
            <input type="checkbox" checked={useCoupon} onChange={e => setUseCoupon(e.target.checked)} />
            Apply coupon code (overloaded constructor)
          </label>
          {useCoupon && (
            <>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 10 }}>Coupon %</label>
              <input className="field" style={{ marginTop: 6 }} type="number" value={couponPct} onChange={e => setCouponPct(Number(e.target.value))} />
            </>
          )}
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={placeOrder}>Place order</button>
        </div>
      </>}
      results={<>
        <JavaConsole log={log.length ? log : [{ out: "// place an order to see the invoice" }]} />
        <VivaCheck
          question="Constructor overloading means:"
          options={[["a", "A class can have only one constructor, ever"], ["b", "A class can have multiple constructors with different parameter lists, letting objects be built in different ways"], ["c", "Constructors can be called like regular methods after object creation"]]}
          correctKey="b"
          explanation="Overloaded constructors share a name (the class name) but differ in their parameter lists — Java picks the right one based on what arguments you pass, letting Order(price, qty) and Order(price, qty, coupon) coexist cleanly."
        />
      </>}
    />
  );
}
