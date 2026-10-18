import {
  ArrowDown,
  ArrowRight,
  Boxes,
  Cloud,
  Cpu,
  GitBranch,
  HardDrive,
  Network,
  Radio,
  Route,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const pools = [
  {
    id: "home",
    name: "Raspberry Pis",
    location: "At home",
    icon: Cpu,
    nodes: [
      { name: "Raspberry Pi 5", role: "Control plane", control: true },
      { name: "Raspberry Pi 5", role: "Worker", control: false },
      { name: "Raspberry Pi 4", role: "Worker", control: false },
    ],
  },
  {
    id: "oracle",
    name: "Oracle Cloud",
    location: "Cloud workers",
    icon: Cloud,
    nodes: [
      { name: "ARM virtual machine", role: "Worker", control: false },
      { name: "x86 virtual machine", role: "Worker", control: false },
      { name: "x86 virtual machine", role: "Worker", control: false },
    ],
  },
  {
    id: "google",
    name: "Google Cloud",
    location: "Cloud worker",
    icon: Cloud,
    nodes: [{ name: "Compute Engine VM", role: "Worker", control: false }],
  },
];
const platform = [
  { name: "Traefik", role: "Ingress", icon: Route },
  { name: "cert-manager", role: "TLS certificates", icon: ShieldCheck },
  { name: "SigNoz", role: "Observability", icon: Radio },
  { name: "Velero", role: "Backups", icon: HardDrive },
];

export function HomelabArchitecture() {
  return (
    <figure
      className="homelab-architecture"
      aria-label="Hybrid k3s architecture"
    >
      <div className="architecture-inputs">
        <div className="architecture-source provisioning-source">
          <GitBranch size={20} aria-hidden="true" />
          <div>
            <span>Infrastructure in Git</span>
            <strong>
              Terraform <ArrowRight size={12} aria-hidden="true" /> Ansible
            </strong>
          </div>
          <span className="architecture-input-flow">
            provision & bootstrap
            <ArrowDown size={12} aria-hidden="true" />
          </span>
        </div>
        <div className="architecture-source application-source">
          <GitBranch size={20} aria-hidden="true" />
          <div>
            <span>Applications in Git</span>
            <strong>Kubernetes manifests</strong>
          </div>
          <span className="architecture-input-flow">
            continuous reconciliation
            <ArrowDown size={12} aria-hidden="true" />
          </span>
        </div>
      </div>
      <section className="architecture-cluster" aria-label="k3s cluster">
        <header className="architecture-cluster-heading">
          <div className="architecture-cluster-title">
            <span className="k3s-symbol">
              <Network size={24} aria-hidden="true" />
            </span>
            <div>
              <h3>k3s cluster</h3>
              <p>One cluster. Home + cloud.</p>
            </div>
          </div>
          <span className="architecture-node-count">
            7 nodes<span>ARM + x86</span>
          </span>
        </header>
        <div className="architecture-delivery">
          <div className="architecture-workloads">
            <span className="architecture-layer-label">Workloads</span>
            <div>
              <span>
                <Boxes size={13} aria-hidden="true" />
                iNAB
              </span>
              <span>Media</span>
              <span>AdGuard</span>
            </div>
          </div>
          <div className="architecture-reconcile">
            <span>reconciles</span>
            <svg viewBox="0 0 100 12" aria-hidden="true">
              <path className="architecture-flow" d="M98 6H4" />
              <path d="m10 1-6 5 6 5" />
            </svg>
          </div>
          <div className="architecture-argo">
            <Workflow size={20} aria-hidden="true" />
            <div>
              <strong>Argo CD</strong>
              <span>GitOps controller</span>
            </div>
          </div>
        </div>
        <div className="architecture-mesh">
          <Network size={14} aria-hidden="true" />
          <strong>Tailscale</strong>
          <span>Encrypted node-to-node mesh</span>
        </div>
        <div className="architecture-mesh-branches" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="architecture-pools">
          {pools.map((pool) => {
            const Icon = pool.icon;
            return (
              <section
                key={pool.id}
                className={`architecture-pool pool-${pool.id}`}
                aria-label={`${pool.name} nodes`}
              >
                <header>
                  <Icon size={17} aria-hidden="true" />
                  <div>
                    <h4>{pool.name}</h4>
                    <span>{pool.location}</span>
                  </div>
                  <span className="pool-node-count">{pool.nodes.length}</span>
                </header>
                <ul>
                  {pool.nodes.map((node, index) => (
                    <li
                      key={index}
                      className={`compute-node ${node.control ? "control-plane-node" : ""}`}
                    >
                      <ServerTile control={node.control} />
                      <div>
                        <strong>{node.name}</strong>
                        <span>{node.role}</span>
                      </div>
                      {node.control && (
                        <span
                          className="control-plane-mark"
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
        <div className="architecture-platform">
          {platform.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.name}>
                <Icon size={16} aria-hidden="true" />
                <strong>{service.name}</strong>
                <span>{service.role}</span>
              </div>
            );
          })}
        </div>
      </section>
      <figcaption className="visually-hidden">
        Configured architecture: three Raspberry Pis, three Oracle Cloud virtual
        machines and one Google Cloud virtual machine form a single k3s cluster
        over Tailscale. A Raspberry Pi 5 runs the control plane; the other six
        nodes are workers. Terraform and Ansible provision the infrastructure,
        Argo CD reconciles applications from Git, and the platform provides
        ingress, TLS, observability and backups.
      </figcaption>
    </figure>
  );
}

function ServerTile({ control }: { control: boolean }) {
  return (
    <svg
      className="server-tile"
      viewBox="0 0 30 32"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="m15 2 12 6v15l-12 7L3 23V8Z"
        fill="currentColor"
        fillOpacity="0.07"
        stroke="currentColor"
      />
      <path
        d="m3 8 12 7 12-7M15 15v15"
        stroke="currentColor"
        strokeOpacity="0.4"
      />
      <path
        d="m8 7 7-3 7 3-7 4Z"
        fill="currentColor"
        fillOpacity={control ? 0.65 : 0.2}
      />
      <path
        d="m7 17 4 2m-4 3 4 2m9-5 3-2m-3 7 3-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
