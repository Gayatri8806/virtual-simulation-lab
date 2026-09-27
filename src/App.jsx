import { useState } from "react";
import SideNav from "./components/SideNav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Labs from "./pages/Labs";
import ElectronicsLabs from "./pages/ElectronicsLabs";
import ProgrammingLabs from "./pages/ProgrammingLabs";
import PhysicsLabs from "./pages/PhysicsLabs";
import MechanicsLabs from "./pages/MechanicsLabs";
import ChemistryLabs from "./pages/ChemistryLabs";
import ElectricalLabs from "./pages/ElectricalLabs";
import DataStructuresLabs from "./pages/DataStructuresLabs";
import OOPCGLabs from "./pages/OOPCGLabs";
import DBMSLabs from "./pages/DBMSLabs";
import MicroprocessorLabs from "./pages/MicroprocessorLabs";
import DELDLabs from "./pages/DELDLabs";

import DiodeLab from "./labs/DiodeLab";
import ZenerLab from "./labs/ZenerLab";
import TransistorLab from "./labs/TransistorLab";
import RectifierLab from "./labs/RectifierLab";
import LogicGateLab from "./labs/LogicGateLab";
import OpAmpLab from "./labs/OpAmpLab";
import Timer555Lab from "./labs/Timer555Lab";

import ListOperationsLab from "./labs/ListOperationsLab";
import AlgoDesignLab from "./labs/AlgoDesignLab";
import VariablesLab from "./labs/VariablesLab";
import ArithmeticLab from "./labs/ArithmeticLab";
import SalaryLab from "./labs/SalaryLab";
import VotingLab from "./labs/VotingLab";
import ArmstrongLab from "./labs/ArmstrongLab";
import SlicingLab from "./labs/SlicingLab";
import StringOpsLab from "./labs/StringOpsLab";
import FileReadLab from "./labs/FileReadLab";
import FileCopyLab from "./labs/FileCopyLab";
import ClassInitLab from "./labs/ClassInitLab";
import EncapsulationLab from "./labs/EncapsulationLab";
import EmployeeClassLab from "./labs/EmployeeClassLab";

import LaserDivergenceLab from "./labs/LaserDivergenceLab";
import FiberNALab from "./labs/FiberNALab";
import PlanckConstantLab from "./labs/PlanckConstantLab";
import NewtonsRingsLab from "./labs/NewtonsRingsLab";
import DiffractionGratingLab from "./labs/DiffractionGratingLab";
import PolarizationLab from "./labs/PolarizationLab";
import BandGapLab from "./labs/BandGapLab";
import SolarCellLab from "./labs/SolarCellLab";

import PolygonForcesLab from "./labs/PolygonForcesLab";
import BeamReactionLab from "./labs/BeamReactionLab";
import FrictionLab from "./labs/FrictionLab";
import RestitutionLab from "./labs/RestitutionLab";
import ConcurrentEquilibriumLab from "./labs/ConcurrentEquilibriumLab";
import ParallelForcesLab from "./labs/ParallelForcesLab";
import TrussLab from "./labs/TrussLab";
import MomentOfInertiaLab from "./labs/MomentOfInertiaLab";

import HardnessLab from "./labs/HardnessLab";
import AlkalinityLab from "./labs/AlkalinityLab";
import AcidPHMetryLab from "./labs/AcidPHMetryLab";
import ConductometricLab from "./labs/ConductometricLab";
import BeersLawLab from "./labs/BeersLawLab";
import ViscometryLab from "./labs/ViscometryLab";
import CoalProximateLab from "./labs/CoalProximateLab";
import ElectroplatingLab from "./labs/ElectroplatingLab";

import SimpleWiringLab from "./labs/SimpleWiringLab";
import StaircaseWiringLab from "./labs/StaircaseWiringLab";
import KirchhoffLab from "./labs/KirchhoffLab";
import SuperpositionLab from "./labs/SuperpositionLab";
import TransformerTestLab from "./labs/TransformerTestLab";
import TransientResponseLab from "./labs/TransientResponseLab";
import RLCResonanceLab from "./labs/RLCResonanceLab";
import ThreePhaseLab from "./labs/ThreePhaseLab";

import LibraryRecordsLab from "./labs/LibraryRecordsLab";
import SearchLab from "./labs/SearchLab";
import SortingLab from "./labs/SortingLab";
import UndoRedoStackLab from "./labs/UndoRedoStackLab";
import CallCenterQueueLab from "./labs/CallCenterQueueLab";
import LinkedListLab from "./labs/LinkedListLab";
import HashTableLab from "./labs/HashTableLab";
import GraphTraversalLab from "./labs/GraphTraversalLab";

import CalculatorLab from "./labs/CalculatorLab";
import ECommerceLab from "./labs/ECommerceLab";
import InheritanceLab from "./labs/InheritanceLab";
import ATMLab from "./labs/ATMLab";
import LineDrawingLab from "./labs/LineDrawingLab";
import CircleDrawingLab from "./labs/CircleDrawingLab";
import TransformLab from "./labs/TransformLab";
import LineClippingLab from "./labs/LineClippingLab";

import ERDiagramLab from "./labs/ERDiagramLab";
import DDLLab from "./labs/DDLLab";
import DMLQueriesLab from "./labs/DMLQueriesLab";
import ViewsIndexesLab from "./labs/ViewsIndexesLab";
import StoredProcFuncLab from "./labs/StoredProcFuncLab";
import TriggersLab from "./labs/TriggersLab";
import TransactionsLab from "./labs/TransactionsLab";
import MongoDBLab from "./labs/MongoDBLab";

import AdditionLab from "./labs/AdditionLab";
import MultiplicationLab from "./labs/MultiplicationLab";
import BubbleSortLab from "./labs/BubbleSortLab";
import MaxMinLab from "./labs/MaxMinLab";
import StringReverseLab from "./labs/StringReverseLab";
import PalindromeLab from "./labs/PalindromeLab";
import BlockTransferLab from "./labs/BlockTransferLab";
import ArraySumLab from "./labs/ArraySumLab";

import NumberSystemsLab from "./labs/NumberSystemsLab";
import KMapLab from "./labs/KMapLab";
import AdderSubtractorLab from "./labs/AdderSubtractorLab";
import MuxDemuxLab from "./labs/MuxDemuxLab";
import DecoderEncoderLab from "./labs/DecoderEncoderLab";
import FlipFlopLab from "./labs/FlipFlopLab";
import ShiftRegisterLab from "./labs/ShiftRegisterLab";
import CounterLab from "./labs/CounterLab";

import "./index.css";

const LAB_PAGES = new Set([
  "lab-diode", "lab-zener", "lab-transistor", "lab-rectifier",
  "lab-logic", "lab-opamp", "lab-555", "lab-list-ops",
  "lab-algo-design", "lab-variables", "lab-arithmetic", "lab-salary",
  "lab-voting", "lab-armstrong", "lab-slicing", "lab-string-ops",
  "lab-file-read", "lab-file-copy", "lab-class-init", "lab-encapsulation",
  "lab-employee-class", "lab-laser-divergence", "lab-fiber-na", "lab-planck",
  "lab-newtons-rings", "lab-diffraction", "lab-polarization", "lab-bandgap",
  "lab-solar-cell", "lab-polygon-forces", "lab-beam-reaction", "lab-friction",
  "lab-restitution", "lab-concurrent-equilibrium", "lab-parallel-forces",
  "lab-truss", "lab-moment-inertia", "lab-hardness", "lab-alkalinity",
  "lab-ph-metry", "lab-conductometric", "lab-beers-law", "lab-viscometry",
  "lab-coal-proximate", "lab-electroplating", "lab-simple-wiring",
  "lab-staircase-wiring", "lab-kirchhoff", "lab-superposition",
  "lab-transformer", "lab-transient", "lab-rlc-resonance", "lab-three-phase",
  "lab-library-records", "lab-search", "lab-sorting", "lab-undo-redo",
  "lab-call-queue", "lab-linked-list", "lab-hash-table", "lab-graph-traversal",
  "lab-calculator", "lab-ecommerce", "lab-inheritance", "lab-atm",
  "lab-line-drawing", "lab-circle-drawing", "lab-transform", "lab-line-clipping",
  "lab-er-diagram", "lab-ddl", "lab-dml-queries", "lab-views-indexes",
  "lab-stored-proc", "lab-triggers", "lab-transactions", "lab-mongodb",
  "lab-addition", "lab-multiplication", "lab-bubble-sort", "lab-maxmin",
  "lab-string-reverse", "lab-palindrome", "lab-block-transfer", "lab-array-sum",
  "lab-number-systems", "lab-kmap", "lab-adder-subtractor", "lab-mux-demux",
  "lab-decoder-encoder", "lab-flipflop", "lab-shift-register", "lab-counter",
]);

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#F4F1E6", color: "#12222E", display: "flex" }}>
      <SideNav page={page} setPage={setPage} user={user} />
      <main style={{ flex: 1, minHeight: "100vh" }} className={LAB_PAGES.has(page) ? "" : "paper-bg"}>
        {page === "home" && <Home setPage={setPage} />}
        {page === "login" && <Login setPage={setPage} setUser={setUser} />}
        {page === "about" && <About />}
        {page === "contact" && <Contact />}
        {page === "labs" && <Labs setPage={setPage} user={user} />}

        {page === "labs-electronics" && <ElectronicsLabs setPage={setPage} />}
        {page === "labs-programming" && <ProgrammingLabs setPage={setPage} />}
        {page === "labs-physics" && <PhysicsLabs setPage={setPage} />}
        {page === "labs-mechanics" && <MechanicsLabs setPage={setPage} />}
        {page === "labs-chemistry" && <ChemistryLabs setPage={setPage} />}
        {page === "labs-electrical" && <ElectricalLabs setPage={setPage} />}
        {page === "labs-datastructures" && <DataStructuresLabs setPage={setPage} />}
        {page === "labs-oopcg" && <OOPCGLabs setPage={setPage} />}
        {page === "labs-dbms" && <DBMSLabs setPage={setPage} />}
        {page === "labs-microprocessor" && <MicroprocessorLabs setPage={setPage} />}
        {page === "labs-deld" && <DELDLabs setPage={setPage} />}

        {page === "lab-diode" && <DiodeLab setPage={setPage} />}
        {page === "lab-zener" && <ZenerLab setPage={setPage} />}
        {page === "lab-transistor" && <TransistorLab setPage={setPage} />}
        {page === "lab-rectifier" && <RectifierLab setPage={setPage} />}
        {page === "lab-logic" && <LogicGateLab setPage={setPage} />}
        {page === "lab-opamp" && <OpAmpLab setPage={setPage} />}
        {page === "lab-555" && <Timer555Lab setPage={setPage} />}

        {page === "lab-list-ops" && <ListOperationsLab setPage={setPage} />}
        {page === "lab-algo-design" && <AlgoDesignLab setPage={setPage} />}
        {page === "lab-variables" && <VariablesLab setPage={setPage} />}
        {page === "lab-arithmetic" && <ArithmeticLab setPage={setPage} />}
        {page === "lab-salary" && <SalaryLab setPage={setPage} />}
        {page === "lab-voting" && <VotingLab setPage={setPage} />}
        {page === "lab-armstrong" && <ArmstrongLab setPage={setPage} />}
        {page === "lab-slicing" && <SlicingLab setPage={setPage} />}
        {page === "lab-string-ops" && <StringOpsLab setPage={setPage} />}
        {page === "lab-file-read" && <FileReadLab setPage={setPage} />}
        {page === "lab-file-copy" && <FileCopyLab setPage={setPage} />}
        {page === "lab-class-init" && <ClassInitLab setPage={setPage} />}
        {page === "lab-encapsulation" && <EncapsulationLab setPage={setPage} />}
        {page === "lab-employee-class" && <EmployeeClassLab setPage={setPage} />}

        {page === "lab-laser-divergence" && <LaserDivergenceLab setPage={setPage} />}
        {page === "lab-fiber-na" && <FiberNALab setPage={setPage} />}
        {page === "lab-planck" && <PlanckConstantLab setPage={setPage} />}
        {page === "lab-newtons-rings" && <NewtonsRingsLab setPage={setPage} />}
        {page === "lab-diffraction" && <DiffractionGratingLab setPage={setPage} />}
        {page === "lab-polarization" && <PolarizationLab setPage={setPage} />}
        {page === "lab-bandgap" && <BandGapLab setPage={setPage} />}
        {page === "lab-solar-cell" && <SolarCellLab setPage={setPage} />}

        {page === "lab-polygon-forces" && <PolygonForcesLab setPage={setPage} />}
        {page === "lab-beam-reaction" && <BeamReactionLab setPage={setPage} />}
        {page === "lab-friction" && <FrictionLab setPage={setPage} />}
        {page === "lab-restitution" && <RestitutionLab setPage={setPage} />}
        {page === "lab-concurrent-equilibrium" && <ConcurrentEquilibriumLab setPage={setPage} />}
        {page === "lab-parallel-forces" && <ParallelForcesLab setPage={setPage} />}
        {page === "lab-truss" && <TrussLab setPage={setPage} />}
        {page === "lab-moment-inertia" && <MomentOfInertiaLab setPage={setPage} />}

        {page === "lab-hardness" && <HardnessLab setPage={setPage} />}
        {page === "lab-alkalinity" && <AlkalinityLab setPage={setPage} />}
        {page === "lab-ph-metry" && <AcidPHMetryLab setPage={setPage} />}
        {page === "lab-conductometric" && <ConductometricLab setPage={setPage} />}
        {page === "lab-beers-law" && <BeersLawLab setPage={setPage} />}
        {page === "lab-viscometry" && <ViscometryLab setPage={setPage} />}
        {page === "lab-coal-proximate" && <CoalProximateLab setPage={setPage} />}
        {page === "lab-electroplating" && <ElectroplatingLab setPage={setPage} />}

        {page === "lab-simple-wiring" && <SimpleWiringLab setPage={setPage} />}
        {page === "lab-staircase-wiring" && <StaircaseWiringLab setPage={setPage} />}
        {page === "lab-kirchhoff" && <KirchhoffLab setPage={setPage} />}
        {page === "lab-superposition" && <SuperpositionLab setPage={setPage} />}
        {page === "lab-transformer" && <TransformerTestLab setPage={setPage} />}
        {page === "lab-transient" && <TransientResponseLab setPage={setPage} />}
        {page === "lab-rlc-resonance" && <RLCResonanceLab setPage={setPage} />}
        {page === "lab-three-phase" && <ThreePhaseLab setPage={setPage} />}

        {page === "lab-library-records" && <LibraryRecordsLab setPage={setPage} />}
        {page === "lab-search" && <SearchLab setPage={setPage} />}
        {page === "lab-sorting" && <SortingLab setPage={setPage} />}
        {page === "lab-undo-redo" && <UndoRedoStackLab setPage={setPage} />}
        {page === "lab-call-queue" && <CallCenterQueueLab setPage={setPage} />}
        {page === "lab-linked-list" && <LinkedListLab setPage={setPage} />}
        {page === "lab-hash-table" && <HashTableLab setPage={setPage} />}
        {page === "lab-graph-traversal" && <GraphTraversalLab setPage={setPage} />}

        {page === "lab-calculator" && <CalculatorLab setPage={setPage} />}
        {page === "lab-ecommerce" && <ECommerceLab setPage={setPage} />}
        {page === "lab-inheritance" && <InheritanceLab setPage={setPage} />}
        {page === "lab-atm" && <ATMLab setPage={setPage} />}
        {page === "lab-line-drawing" && <LineDrawingLab setPage={setPage} />}
        {page === "lab-circle-drawing" && <CircleDrawingLab setPage={setPage} />}
        {page === "lab-transform" && <TransformLab setPage={setPage} />}
        {page === "lab-line-clipping" && <LineClippingLab setPage={setPage} />}

        {page === "lab-er-diagram" && <ERDiagramLab setPage={setPage} />}
        {page === "lab-ddl" && <DDLLab setPage={setPage} />}
        {page === "lab-dml-queries" && <DMLQueriesLab setPage={setPage} />}
        {page === "lab-views-indexes" && <ViewsIndexesLab setPage={setPage} />}
        {page === "lab-stored-proc" && <StoredProcFuncLab setPage={setPage} />}
        {page === "lab-triggers" && <TriggersLab setPage={setPage} />}
        {page === "lab-transactions" && <TransactionsLab setPage={setPage} />}
        {page === "lab-mongodb" && <MongoDBLab setPage={setPage} />}

        {page === "lab-addition" && <AdditionLab setPage={setPage} />}
        {page === "lab-multiplication" && <MultiplicationLab setPage={setPage} />}
        {page === "lab-bubble-sort" && <BubbleSortLab setPage={setPage} />}
        {page === "lab-maxmin" && <MaxMinLab setPage={setPage} />}
        {page === "lab-string-reverse" && <StringReverseLab setPage={setPage} />}
        {page === "lab-palindrome" && <PalindromeLab setPage={setPage} />}
        {page === "lab-block-transfer" && <BlockTransferLab setPage={setPage} />}
        {page === "lab-array-sum" && <ArraySumLab setPage={setPage} />}

        {page === "lab-number-systems" && <NumberSystemsLab setPage={setPage} />}
        {page === "lab-kmap" && <KMapLab setPage={setPage} />}
        {page === "lab-adder-subtractor" && <AdderSubtractorLab setPage={setPage} />}
        {page === "lab-mux-demux" && <MuxDemuxLab setPage={setPage} />}
        {page === "lab-decoder-encoder" && <DecoderEncoderLab setPage={setPage} />}
        {page === "lab-flipflop" && <FlipFlopLab setPage={setPage} />}
        {page === "lab-shift-register" && <ShiftRegisterLab setPage={setPage} />}
        {page === "lab-counter" && <CounterLab setPage={setPage} />}
      </main>
    </div>
  );
}
