import { useState } from "react";
import PyLabShell from "./py/PyLabShell";
import PyShell from "./py/PyShell";
import VivaCheck from "./py/VivaCheck";

export default function ClassInitLab({ setPage }) {
  const [name, setName] = useState("Swift");
  const [color, setColor] = useState("Red");
  const [year, setYear] = useState(2023);
  const [log, setLog] = useState([]);

  const run = () => {
    setLog(prev => [...prev, {
      code: `class Car:\n    def __init__(self, name, color, year):\n        self.name = name\n        self.color = color\n        self.year = year\n\n    def describe(self):\n        return f"{self.year} {self.color} {self.name}"\n\nmy_car = Car("${name}", "${color}", ${year})\nprint(my_car.describe())`,
      out: `'${year} ${color} ${name}'`,
    }]);
  };

  return (
    <PyLabShell
      setPage={setPage}
      unit="unit V"
      title="Classes and the __init__() method"
      aim="Aim: define a class with an __init__() constructor that sets instance attributes, then create an object and call a method on it."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>name</label>
          <input className="field" style={{ marginTop: 6 }} value={name} onChange={e => setName(e.target.value)} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>color</label>
          <input className="field" style={{ marginTop: 6 }} value={color} onChange={e => setColor(e.target.value)} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>year</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={year} onChange={e => setYear(e.target.value)} />
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={run}>Run</button>
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: 'my_car = Car("Swift", "Red", 2023)\nprint(my_car.describe())', out: "'2023 Red Swift'" }]} />
        <VivaCheck
          question="When is __init__() called?"
          options={[["a", "Automatically, every time a new object of the class is created"], ["b", "Only when you call it by name"], ["c", "Once per program, no matter how many objects you make"]]}
          correctKey="a"
          explanation={`__init__() is Python's constructor — it runs automatically each time you create a new instance, e.g. Car("Swift", "Red", 2023) triggers it immediately.`}
        />
      </>}
    />
  );
}
