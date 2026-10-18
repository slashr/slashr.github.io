"use client";
import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  GitBranch,
  Server,
  Cloud,
  Workflow,
} from "lucide-react";

const phases = [
  { name: "Squat", label: "Set 1 of 3", seconds: 40 },
  { name: "Rest", label: "Before set 2", seconds: 25 },
  { name: "Squat", label: "Set 2 of 3", seconds: 40 },
  { name: "Rest", label: "Before set 3", seconds: 25 },
  { name: "Squat", label: "Set 3 of 3", seconds: 40 },
  { name: "Finished", label: "Session complete", seconds: 0 },
];
export function WorkoutDemo({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0),
    [remaining, setRemaining] = useState(40),
    [running, setRunning] = useState(false);
  useEffect(() => {
    if (!active) setRunning(false);
  }, [active]);
  useEffect(() => {
    if (!running || !active) return;
    const deadline = performance.now() + remaining * 1000;
    const interval = setInterval(() => {
      const left = Math.max(
        0,
        Math.ceil((deadline - performance.now()) / 1000),
      );
      setRemaining(left);
      if (!left) {
        setRunning(false);
        const next = Math.min(phase + 1, phases.length - 1);
        setPhase(next);
        setRemaining(phases[next].seconds);
      }
    }, 200);
    const visibility = () => {
      if (document.hidden) setRunning(false);
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", visibility);
    };
    // remaining is the starting value for this run; interval updates must not
    // continually move the deadline forward.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase, active]);
  const reset = () => {
    setRunning(false);
    setPhase(0);
    setRemaining(40);
  };
  const next = () => {
    const index = Math.min(phase + 1, phases.length - 1);
    setRunning(false);
    setPhase(index);
    setRemaining(phases[index].seconds);
  };
  const done = phase === phases.length - 1;
  const progress = phases[phase].seconds
    ? ((phases[phase].seconds - remaining) / phases[phase].seconds) * 100
    : 100;
  return (
    <div className="demo workout-demo">
      <div className="demo-top">
        <span>Power Hour</span>
        <span className="demo-badge">Interactive sketch</span>
      </div>
      <h3>{phases[phase].name}</h3>
      <p className="demo-subtitle">{phases[phase].label}</p>
      <div
        className="timer-ring"
        style={{
          background: `conic-gradient(var(--accent) ${progress}%, var(--accent-soft) 0)`,
        }}
      >
        <span className="timer-value">
          {String(Math.floor(remaining / 60)).padStart(2, "0")}:
          {String(remaining % 60).padStart(2, "0")}
        </span>
      </div>
      <div className="demo-actions">
        <button
          type="button"
          className="button button-primary"
          onClick={() => (done ? reset() : setRunning(!running))}
        >
          {running ? (
            <Pause size={14} aria-hidden="true" />
          ) : (
            <Play size={14} aria-hidden="true" />
          )}
          {done ? "Again" : running ? "Pause" : "Start demo"}
        </button>
        <button type="button" className="button" onClick={next} disabled={done}>
          Next <ArrowRight size={13} aria-hidden="true" />
        </button>
      </div>
      <div className="demo-footer">
        <span>Illustrative session</span>
        <span>{running ? "Running" : done ? "Finished" : "Paused"}</span>
      </div>
      <button type="button" className="text-button" onClick={reset}>
        <RotateCcw size={11} aria-hidden="true" />
        Reset session
      </button>
    </div>
  );
}
export function BudgetDemo() {
  const [budget, setBudget] = useState(320),
    [spent, setSpent] = useState(186);
  const remaining = budget - spent;
  return (
    <div className="demo budget-demo">
      <div className="demo-top">
        <span>iNAB / Budget</span>
        <span className="demo-badge">Sample data</span>
      </div>
      <span className="budget-label">
        Dining {remaining < 0 ? "over budget" : "remaining"}
      </span>
      <div className="budget-value" aria-live="polite">
        {remaining < 0 ? "−" : ""}€{Math.abs(remaining)}
      </div>
      <div className="budget-row">
        <span>Dining</span>
        <span>
          €{spent} / €{budget}
        </span>
      </div>
      <div className="budget-bar">
        <span style={{ width: `${Math.min((spent / budget) * 100, 100)}%` }} />
      </div>
      <div className="budget-row">
        <span>Groceries</span>
        <span>€248 / €400</span>
      </div>
      <div className="budget-bar">
        <span style={{ width: "62%", opacity: 0.45 }} />
      </div>
      <label className="range-label" htmlFor="dining-budget">
        <span>Dining budget</span>
        <span>€{budget}</span>
      </label>
      <input
        id="dining-budget"
        type="range"
        min="200"
        max="600"
        step="20"
        value={budget}
        onChange={(event) => setBudget(Number(event.target.value))}
      />
      <div className="demo-actions">
        <button
          type="button"
          className="button button-primary"
          onClick={() => setSpent((value) => value + 20)}
        >
          Add €20 expense
        </button>
        <button
          type="button"
          className="button"
          onClick={() => {
            setBudget(320);
            setSpent(186);
          }}
        >
          Reset
        </button>
      </div>
      <p className="demo-disclaimer">
        A small interaction sketch with fictional numbers.
      </p>
    </div>
  );
}
const nodes = [
  {
    id: "git",
    label: "Git repo",
    Icon: GitBranch,
    text: "Application manifests describe the state I want to run.",
  },
  {
    id: "argo",
    label: "Argo CD",
    Icon: Workflow,
    text: "Argo CD syncs the application manifests from Git.",
  },
  {
    id: "pi",
    label: "Raspberry Pis",
    Icon: Server,
    text: "Local k3s nodes run applications and services.",
  },
  {
    id: "cloud",
    label: "Cloud nodes",
    Icon: Cloud,
    text: "Cloud nodes join the cluster over Tailscale.",
  },
];
const messages = [
  "Demo: a manifest change is committed.",
  "Demo: Argo CD picks up the change.",
  "Demo: workloads roll out to the local nodes.",
  "Demo: cloud workloads roll out.",
];
export function HomelabDemo({ active }: { active: boolean }) {
  const [node, setNode] = useState(1),
    [step, setStep] = useState(0),
    [running, setRunning] = useState(false),
    [status, setStatus] = useState(
      "Choose a node to explore the architecture.",
    );
  useEffect(() => {
    if (!active && running) {
      setRunning(false);
      setStatus("Simulation paused.");
    }
  }, [active, running]);
  useEffect(() => {
    if (!running || !active) return;
    const timer = setTimeout(() => {
      if (step === 3) {
        setRunning(false);
        setStatus("Demo complete. No changes were made to the cluster.");
      } else {
        setStep(step + 1);
        setNode(step + 1);
        setStatus(messages[step + 1]);
      }
    }, 950);
    const pause = () => {
      if (document.hidden) {
        setRunning(false);
        setStatus("Simulation paused.");
      }
    };
    document.addEventListener("visibilitychange", pause);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", pause);
    };
  }, [running, step, active]);
  return (
    <div className="demo lab-demo">
      <div className="demo-top">
        <span>Homelab</span>
        <span className="demo-badge">Architecture sketch</span>
      </div>
      <div className="topology">
        <svg
          viewBox="0 0 400 240"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M200 43 L200 88 M200 130 L200 160 L85 160 L85 197 M200 160 L315 160 L315 197"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
        {nodes.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`topology-node node-${item.id}`}
            aria-pressed={node === index}
            onClick={() => {
              setRunning(false);
              setNode(index);
              setStatus("Choose a node to explore the architecture.");
            }}
          >
            <item.Icon size={17} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="node-information">
        <h3>{nodes[node].label}</h3>
        <p>{nodes[node].text}</p>
      </div>
      <button
        type="button"
        className="button button-primary deploy-button"
        onClick={() => {
          if (running) {
            setRunning(false);
            setStatus("Simulation paused.");
          } else {
            setStep(0);
            setNode(0);
            setRunning(true);
            setStatus(messages[0]);
          }
        }}
      >
        <Play size={14} aria-hidden="true" />
        {running ? "Stop simulation" : "Simulate deployment"}
      </button>
      <p className="deploy-status" role="status">
        {status}
      </p>
      <p className="demo-disclaimer">
        Diagram of the setup, not live cluster status.
      </p>
    </div>
  );
}
