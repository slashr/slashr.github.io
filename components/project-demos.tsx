"use client";
import { useEffect, useState } from "react";
import { Play, GitBranch, Server, Cloud, Workflow } from "lucide-react";

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
