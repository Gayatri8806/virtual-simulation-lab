import { useState } from "react";
import OOPCGLabShell from "./oopcg/OOPCGLabShell";
import JavaConsole from "./oopcg/JavaConsole";
import VivaCheck from "./oopcg/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function InheritanceLab({ setPage }) {
  const [log, setLog] = useState([]);

  const createVehicle = () => {
    setLog(prev => [...prev, { out: `Vehicle v = new Vehicle("Generic", 60);\nv.describe();\n\n>> Vehicle: Generic, max speed 60 km/h` }]);
  };
  const createCar = () => {
    setLog(prev => [...prev, {
      out: `Car c = new Car("Sedan", 180, 5);\nc.describe();     // inherited from Vehicle\nc.honk();         // Car's own method\n\n>> Vehicle: Sedan, max speed 180 km/h\n>> Car: 5 seats\n>> Beep beep!`,
    }]);
  };
  const showOverride = () => {
    setLog(prev => [...prev, {
      out: `Vehicle v2 = new Car("SUV", 160, 7);  // upcasting\nv2.describe();  // calls Car's OVERRIDDEN version, not Vehicle's\n\n>> Vehicle: SUV, max speed 160 km/h\n>> Car: 7 seats\n// even though v2's declared type is Vehicle, the actual object is Car`,
    }]);
  };

  return (
    <OOPCGLabShell
      setPage={setPage}
      group="Group A &middot; OOP"
      title="Single inheritance — Car extends Vehicle"
      aim="Aim: define a Vehicle superclass and a Car subclass that extends it, demonstrating inherited methods, the subclass's own additional methods, and runtime polymorphism through method overriding."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Class hierarchy</p>
          <pre className="mono" style={{ fontSize: 12, color: INK_SOFT, background: "#0F1D27", padding: "10px 12px", borderRadius: 6, margin: 0 }}>
{`class Vehicle {
  String model; int maxSpeed;
  void describe() { ... }
}
class Car extends Vehicle {
  int seats;
  void honk() { ... }
  @Override
  void describe() { ... }
}`}
          </pre>
        </div>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn-primary" onClick={createVehicle}>Create plain Vehicle</button>
          <button className="btn-primary" onClick={createCar}>Create Car (inherits + own method)</button>
          <button className="btn-primary" onClick={showOverride}>Show method overriding (upcast)</button>
        </div>
      </>}
      results={<>
        <JavaConsole log={log.length ? log : [{ out: "// try each button on the left" }]} />
        <VivaCheck
          question="When a Car object is referenced through a Vehicle-typed variable and describe() is called, which version runs?"
          options={[["a", "Vehicle's version, because that's the declared type"], ["b", "Car's overridden version, because Java resolves overridden methods based on the actual object type at runtime", ], ["c", "Neither — this causes a compile error"]]}
          correctKey="b"
          explanation="This is runtime polymorphism: Java looks at the actual object's type (Car) when deciding which overridden method to call, not the variable's declared type (Vehicle). This is what lets a single Vehicle reference behave differently depending on what it actually points to."
        />
      </>}
    />
  );
}
