export type ProjectId = "power-hour" | "inab" | "homelab";
export type Screenshot = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};
export type Project = {
  id: ProjectId;
  name: string;
  short: string;
  type: string;
  description: string;
  stack: string[];
  notes: string[];
  screenshots: Screenshot[];
};
export const projects: Project[] = [
  {
    id: "power-hour",
    name: "Power Hour",
    short: "Workout app",
    type: "iOS · Fitness",
    description:
      "A workout app I use at the gym. Timed sets, spoken cues, and a logbook of the work.",
    stack: ["SwiftUI", "Live Activities", "Spotify"],
    notes: [
      "Workout cues continue with the screen locked.",
      "Sets stay in a local logbook.",
      "Built for the way I train.",
    ],
    screenshots: [
      {
        src: "/projects/power-hour-workout.webp",
        alt: "Power Hour resting between sets, with Pull ups x 2 and 8 reps up next",
        caption: "Workout screen · between sets",
        width: 708,
        height: 1539,
      },
      {
        src: "/projects/power-hour-muscles.webp",
        alt: "Power Hour logbook showing muscle coverage for the bundled sample routines",
        caption: "Muscle coverage · bundled sample routines",
        width: 708,
        height: 1539,
      },
    ],
  },
  {
    id: "inab",
    name: "iNAB",
    short: "Personal finance",
    type: "Web & iOS · Finance",
    description:
      "My personal finance dashboard, with an iPhone companion. Budgets, spending, and investments.",
    stack: ["React", "Python", "SwiftUI"],
    notes: [
      "The web dashboard and iPhone app share a private API.",
      "Self-hosted on my homelab.",
      "The captures here use entirely fictional finances.",
    ],
    screenshots: [
      {
        src: "/projects/inab-home.webp",
        alt: "The actual iNAB dashboard showing its overview and charts with fictional test data",
        caption: "Actual dashboard · fictional test data",
        width: 1440,
        height: 1050,
      },
      {
        src: "/projects/inab-budget.webp",
        alt: "The actual iNAB budget workspace rendered with fictional test data",
        caption: "Budget workspace · fictional test data",
        width: 1440,
        height: 1050,
      },
    ],
  },
  {
    id: "homelab",
    name: "Homelab",
    short: "k3s cluster",
    type: "Infrastructure · Self-hosted",
    description:
      "One k3s cluster across Raspberry Pis, Oracle Cloud and Google Cloud. Managed from code, connected over Tailscale.",
    stack: ["k3s", "Terraform", "Ansible", "Tailscale", "Argo CD"],
    notes: [
      "Terraform and Ansible handle provisioning.",
      "Tailscale connects the local and cloud nodes.",
      "Argo CD deploys applications from Git.",
    ],
    screenshots: [],
  },
];
