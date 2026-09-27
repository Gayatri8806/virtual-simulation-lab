import { Zap, CircuitBoard, FlaskConical, Gauge } from "lucide-react";

export const INK = "#12222E";
export const INK_SOFT = "#42566A";
export const PAPER = "#F4F1E6";
export const GRID_LINE = "#D8D2BE";
export const AMBER = "#D9891F";
export const TEAL = "#2E6F63";
export const TEAL_DARK = "#1E4B43";
export const PANEL = "#FFFDF6";

export const SUBJECTS = [
  { id: "physics", name: "Engineering Physics", count: 8, icon: Zap, ready: true, readyCount: 8, page: "labs-physics" },
  { id: "chemistry", name: "Engineering Chemistry", count: 8, icon: FlaskConical, ready: true, readyCount: 8, page: "labs-chemistry" },
  { id: "electrical", name: "Basic Electrical Engineering", count: 8, icon: CircuitBoard, ready: true, readyCount: 8, page: "labs-electrical" },
  { id: "electronics", name: "Basic Electronics Engineering", count: 7, icon: Gauge, ready: true, readyCount: 7, page: "labs-electronics" },
  { id: "mechanics", name: "Engineering Mechanics", count: 8, icon: Zap, ready: true, readyCount: 8, page: "labs-mechanics" },
  { id: "programming", name: "Programming for Problem Solving", count: 14, icon: CircuitBoard, ready: true, readyCount: 14, page: "labs-programming" },
];

export const SE_SUBJECTS = [
  { id: "datastructures", name: "Data Structures", count: 8, icon: CircuitBoard, ready: true, readyCount: 8, page: "labs-datastructures" },
  { id: "oop-cg", name: "Object Oriented Programming & Computer Graphics", count: 8, icon: CircuitBoard, ready: true, readyCount: 8, page: "labs-oopcg" },
  { id: "digital-electronics", name: "Digital Electronics & Logic Design", count: 8, icon: CircuitBoard, ready: true, readyCount: 8, page: "labs-deld" },
  { id: "dbms", name: "Database Management Systems", count: 8, icon: CircuitBoard, ready: true, readyCount: 8, page: "labs-dbms" },
  { id: "coa", name: "Microprocessor Laboratory", count: 8, icon: CircuitBoard, ready: true, readyCount: 8, page: "labs-microprocessor" },
];

export const ELECTRONICS_LABS = [
  { id: "lab-diode", title: "PN junction diode V-I characteristics", blurb: "Plot forward-bias V-I curve, find the knee voltage." },
  { id: "lab-zener", title: "Zener diode as a voltage regulator", blurb: "See line regulation kick in once Vin passes breakdown." },
  { id: "lab-transistor", title: "BJT characteristics (CE configuration)", blurb: "Sweep Vce and Ib, see active vs saturation region." },
  { id: "lab-rectifier", title: "Half-wave / full-wave rectifier with filter", blurb: "Compare ripple with and without a filter capacitor." },
  { id: "lab-logic", title: "Logic gate verification", blurb: "Toggle inputs, confirm the truth table for six gates." },
  { id: "lab-opamp", title: "Op-amp inverting / non-inverting amplifier", blurb: "Set resistor ratios, watch gain and saturation." },
  { id: "lab-555", title: "555 timer: astable / monostable", blurb: "Tune R and C, read off frequency, duty cycle, or pulse width." },
];

export const PROGRAMMING_LABS = [
  { id: "lab-algo-design", unit: "Unit I", title: "Algorithm, flowchart & pseudocode", blurb: "See the same logic as algorithm, pseudocode, and flowchart.", ready: true },
  { id: "lab-variables", unit: "Unit I", title: "Variables and literals", blurb: "Assign a literal, see what type Python infers.", ready: true },
  { id: "lab-arithmetic", unit: "Unit I", title: "Arithmetic operators & expressions", blurb: "Try +, -, *, /, //, %, ** on two numbers.", ready: true },
  { id: "lab-salary", unit: "Unit I", title: "Employee gross & net salary calculator", blurb: "Basic pay, HRA, DA and deductions computed live.", ready: true },
  { id: "lab-voting", unit: "Unit II", title: "Voting eligibility checker", blurb: "if-else logic on age.", ready: true },
  { id: "lab-armstrong", unit: "Unit II", title: "Armstrong number checker", blurb: "Digit-power sum check, step by step.", ready: true },
  { id: "lab-list-ops", unit: "Unit II", title: "Operations on a list", blurb: "Append, insert, remove, pop, sort, reverse and slice — live.", ready: true },
  { id: "lab-slicing", unit: "Unit III", title: "String slicing operations", blurb: "s[start:end:step], including reverse and skip.", ready: true },
  { id: "lab-string-ops", unit: "Unit III", title: "String ops: length, reverse, palindrome, substring", blurb: "Four classic string checks in one place.", ready: true },
  { id: "lab-file-read", unit: "Unit IV", title: "Read and display file contents", blurb: "Simulated file, read() and line-by-line.", ready: true },
  { id: "lab-file-copy", unit: "Unit IV", title: "Copy file with case & punctuation transforms", blurb: "Source to destination, transformed line by line.", ready: true },
  { id: "lab-class-init", unit: "Unit V", title: "Classes and __init__()", blurb: "Define a class, construct an object, call a method.", ready: true },
  { id: "lab-encapsulation", unit: "Unit V", title: "Public vs private class members", blurb: "Name mangling and getter methods, demonstrated.", ready: true },
  { id: "lab-employee-class", unit: "Unit V", title: "Employee class with a computed method", blurb: "OOP version of the salary calculator.", ready: true },
];

export const PHYSICS_LABS = [
  { id: "lab-laser-divergence", unit: "Unit I", title: "Divergence of a laser beam", blurb: "Measure beam diameter at two distances, compute divergence.", ready: true },
  { id: "lab-fiber-na", unit: "Unit I", title: "Numerical aperture of an optical fiber", blurb: "From core/cladding index, plus a light-spot cross-check.", ready: true },
  { id: "lab-planck", unit: "Unit II", title: "Determination of Planck's constant", blurb: "Stopping voltage vs frequency across 5 LED colors.", ready: true },
  { id: "lab-newtons-rings", unit: "Unit III", title: "Newton's rings", blurb: "Ring diameters give the lens's radius of curvature.", ready: true },
  { id: "lab-diffraction", unit: "Unit III", title: "Diffraction grating", blurb: "Find the laser wavelength from d·sinθ = nλ.", ready: true },
  { id: "lab-polarization", unit: "Unit III", title: "Verification of Malus's law", blurb: "Rotate the analyzer, confirm I = I₀cos²θ.", ready: true },
  { id: "lab-bandgap", unit: "Unit IV", title: "Band gap energy of a semiconductor", blurb: "Vf vs temperature, extrapolated to find Eg.", ready: true },
  { id: "lab-solar-cell", unit: "Unit IV", title: "I-V characteristics of a solar cell", blurb: "Voc, Isc, fill factor and efficiency.", ready: true },
];

export const MECHANICS_LABS = [
  { id: "lab-polygon-forces", unit: "Compulsory A1", title: "Verification of the polygon law of forces", blurb: "Draw forces tip-to-tail, find the resultant.", ready: true },
  { id: "lab-beam-reaction", unit: "Compulsory A2", title: "Support reactions of a beam", blurb: "Point load + UDL, solve RA and RB.", ready: true },
  { id: "lab-friction", unit: "Compulsory A3", title: "Coefficient of friction", blurb: "Tilt to the angle of repose, μ = tanθ.", ready: true },
  { id: "lab-restitution", unit: "Compulsory A4", title: "Coefficient of restitution", blurb: "Drop and bounce height give e = √(h2/h1).", ready: true },
  { id: "lab-concurrent-equilibrium", unit: "Graphical B1", title: "Equilibrium of a concurrent force system", blurb: "Find the equilibrant of two known forces.", ready: true },
  { id: "lab-parallel-forces", unit: "Graphical B2", title: "Equilibrium of a parallel force system", blurb: "Resultant magnitude and its line of action.", ready: true },
  { id: "lab-truss", unit: "Graphical B3", title: "Forces in a pin-jointed truss", blurb: "Method of joints on a triangular truss.", ready: true },
  { id: "lab-moment-inertia", unit: "Graphical B4", title: "Moment of inertia of a composite figure", blurb: "T-section centroid and parallel axis theorem.", ready: true },
];

export const CHEMISTRY_LABS = [
  { id: "lab-hardness", unit: "Experiment 1", title: "Hardness of water (EDTA method)", blurb: "Titrate to a wine-red-to-blue endpoint.", ready: true },
  { id: "lab-alkalinity", unit: "Experiment 2", title: "Alkalinity of water", blurb: "Two-stage titration: phenolphthalein then methyl orange.", ready: true },
  { id: "lab-ph-metry", unit: "Experiment 3", title: "pH-metric titration of a strong acid", blurb: "Plot pH vs volume, find the equivalence point.", ready: true },
  { id: "lab-conductometric", unit: "Experiment 4", title: "Conductometric titration of an acid mixture", blurb: "Two breakpoints separate strong and weak acid.", ready: true },
  { id: "lab-beers-law", unit: "Experiment 5", title: "Beer's law & unknown concentration", blurb: "Calibration curve from a colorimeter.", ready: true },
  { id: "lab-viscometry", unit: "Experiment 7", title: "Molecular weight by viscometry", blurb: "Ostwald viscometer, Huggins plot, Mark-Houwink.", ready: true },
  { id: "lab-coal-proximate", unit: "Experiment 8", title: "Proximate analysis of coal", blurb: "Moisture, volatile matter, ash, fixed carbon.", ready: true },
  { id: "lab-electroplating", unit: "Experiment 9", title: "Electroplating (Faraday's laws)", blurb: "Deposit copper or zinc, verify m = ItM/nF.", ready: true },
];

export const ELECTRICAL_LABS = [
  { id: "lab-simple-wiring", unit: "Experiment 1", title: "Simple house wiring", blurb: "Drag pins to wire a single switch-controlled bulb.", ready: true },
  { id: "lab-staircase-wiring", unit: "Experiment 2", title: "Staircase (two-way) wiring", blurb: "Control one bulb from two switch locations.", ready: true },
  { id: "lab-kirchhoff", unit: "Experiment 3", title: "Verification of Kirchhoff's laws", blurb: "Wire a series-parallel network, verify KCL.", ready: true },
  { id: "lab-superposition", unit: "Experiment 4", title: "Superposition theorem", blurb: "Two sources, one load — sum the contributions.", ready: true },
  { id: "lab-transformer", unit: "Experiment 5", title: "Transformer efficiency & regulation", blurb: "Load test from no-load to full-load.", ready: true },
  { id: "lab-transient", unit: "Experiment 6", title: "RL & RC transient response", blurb: "Close the switch, watch the exponential rise.", ready: true },
  { id: "lab-rlc-resonance", unit: "Experiment 7", title: "Series RLC resonance", blurb: "Sweep frequency, find the current peak.", ready: true },
  { id: "lab-three-phase", unit: "Experiment 8", title: "Star vs delta: phase and line quantities", blurb: "See the √3 relationship both ways.", ready: true },
];

export const DS_LABS = [
  { id: "lab-library-records", unit: "Group A", title: "Library records — array operations", blurb: "Average, max/min, zero-count, mode, complexity.", ready: true },
  { id: "lab-search", unit: "Group A", title: "Linear search vs. binary search", blurb: "Compare comparisons needed on customer IDs.", ready: true },
  { id: "lab-sorting", unit: "Group A", title: "Selection sort vs. bubble sort", blurb: "Sort salaries, show top 5, count comparisons.", ready: true },
  { id: "lab-undo-redo", unit: "Group B", title: "Undo/redo editor using a Stack", blurb: "Two stacks: undo history and redo history.", ready: true },
  { id: "lab-call-queue", unit: "Group B", title: "Call center queue using a Queue", blurb: "FIFO call handling, cancel before answered.", ready: true },
  { id: "lab-linked-list", unit: "Group B", title: "Student records via linked list", blurb: "Insert, delete, sort by roll or marks.", ready: true },
  { id: "lab-hash-table", unit: "Group C", title: "Hash table with chaining", blurb: "Division method, insert/search/delete.", ready: true },
  { id: "lab-graph-traversal", unit: "Group D", title: "Graph BFS and DFS traversal", blurb: "Visit order on a small location network.", ready: true },
];

export const OOPCG_LABS = [
  { id: "lab-calculator", unit: "Group A", title: "Calculator: input, conditionals, loops", blurb: "Switch-case operators, plus an accumulator loop.", ready: true },
  { id: "lab-ecommerce", unit: "Group A", title: "E-commerce order — overloaded constructors", blurb: "Bulk discount plus optional coupon code.", ready: true },
  { id: "lab-inheritance", unit: "Group A", title: "Single inheritance — Car extends Vehicle", blurb: "Inherited methods and runtime overriding.", ready: true },
  { id: "lab-atm", unit: "Group A", title: "ATM simulation — try/catch/finally", blurb: "Handle invalid amounts and insufficient funds.", ready: true },
  { id: "lab-line-drawing", unit: "Group B", title: "Line drawing: DDA vs Bresenham", blurb: "Same line, two pixel-plotting algorithms.", ready: true },
  { id: "lab-circle-drawing", unit: "Group B", title: "Circle drawing algorithms", blurb: "Midpoint circle vs trigonometric method.", ready: true },
  { id: "lab-transform", unit: "Group B", title: "2D transformations on a triangle", blurb: "Translate, rotate, scale, and shear live.", ready: true },
  { id: "lab-line-clipping", unit: "Group B", title: "Cohen-Sutherland line clipping", blurb: "Region codes trim a line to a window.", ready: true },
];

export const DBMS_LABS = [
  { id: "lab-er-diagram", unit: "Assignment 1", title: "ER diagram & relational mapping", blurb: "Library case study, entities to tables.", ready: true },
  { id: "lab-ddl", unit: "Assignment 2", title: "DDL: schema with constraints", blurb: "PK, NOT NULL, UNIQUE, CHECK, foreign keys.", ready: true },
  { id: "lab-dml-queries", unit: "Assignment 3", title: "DML: joins, GROUP BY, subqueries", blurb: "Query across STUDENT and MARKS tables.", ready: true },
  { id: "lab-views-indexes", unit: "Assignment 4", title: "Views and indexes", blurb: "Saved queries plus indexed vs full scans.", ready: true },
  { id: "lab-stored-proc", unit: "Assignment 5", title: "PL/SQL procedures and functions", blurb: "Apply a bonus, compute tax.", ready: true },
  { id: "lab-triggers", unit: "Assignment 6", title: "Triggers on INSERT and UPDATE", blurb: "Auto-logging and a low-stock alert.", ready: true },
  { id: "lab-transactions", unit: "Assignment 7", title: "Transactions: COMMIT / ROLLBACK", blurb: "Bank transfer, atomicity in action.", ready: true },
  { id: "lab-mongodb", unit: "Assignment 8", title: "MongoDB CRUD operations", blurb: "Schema-less documents vs relational tables.", ready: true },
];

export const DELD_LABS = [
  { id: "lab-number-systems", unit: "Unit I", title: "Number system and code conversions", blurb: "Binary, octal, hex, Gray code, BCD — live.", ready: true },
  { id: "lab-kmap", unit: "Unit I", title: "Boolean minimization with K-map", blurb: "Click cells, read off the SOP expression.", ready: true },
  { id: "lab-adder-subtractor", unit: "Unit III", title: "Half/full adder and subtractor", blurb: "Toggle inputs, build the truth table live.", ready: true },
  { id: "lab-mux-demux", unit: "Unit III", title: "Multiplexer and demultiplexer", blurb: "Select lines route data both directions.", ready: true },
  { id: "lab-decoder-encoder", unit: "Unit III", title: "Decoder and priority encoder", blurb: "2-to-4 decode, 8-to-3 priority encode.", ready: true },
  { id: "lab-flipflop", unit: "Unit II", title: "SR, JK, D, and T flip-flops", blurb: "Clock pulses, set/reset/hold/toggle.", ready: true },
  { id: "lab-shift-register", unit: "Unit II", title: "Shift registers: SISO/SIPO/PISO/PIPO", blurb: "Four input/output modes, one register.", ready: true },
  { id: "lab-counter", unit: "Unit II", title: "Ripple, synchronous, and mod-N counters", blurb: "Clock through up/down counts.", ready: true },
];

export const MP_LABS = [
  { id: "lab-addition", unit: "ALP 1", title: "Addition of two 16-bit numbers", blurb: "Detect overflow via the carry flag.", ready: true },
  { id: "lab-multiplication", unit: "ALP 2", title: "Multiplication of two 8-bit numbers", blurb: "MUL instruction, 16-bit result in AX.", ready: true },
  { id: "lab-bubble-sort", unit: "ALP 3", title: "Ascending sort (bubble sort)", blurb: "Compare-and-swap traced step by step.", ready: true },
  { id: "lab-maxmin", unit: "ALP 4", title: "Largest and smallest in an array", blurb: "Single pass, two running trackers.", ready: true },
  { id: "lab-string-reverse", unit: "ALP 5", title: "Reverse a string", blurb: "Two index registers, swap inward.", ready: true },
  { id: "lab-palindrome", unit: "ALP 6", title: "Palindrome check", blurb: "Compare from both ends, early exit on mismatch.", ready: true },
  { id: "lab-block-transfer", unit: "ALP 7", title: "Block transfer (memory to memory)", blurb: "Copy an array using SI and DI.", ready: true },
  { id: "lab-array-sum", unit: "ALP 8", title: "Sum of array elements", blurb: "8-bit adds with carry propagation into AH.", ready: true },
];
