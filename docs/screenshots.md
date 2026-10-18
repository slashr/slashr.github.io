# Portfolio app captures

These are actual app interfaces, not rendered concept screens. Files under
`public/projects/` are compressed WebP copies; the originals are kept in their
owning project or in the local capture workspace. No personal financial data
is used in the iNAB screenshots.

## Power Hour

The source checkout was at `31891c412eeab3d35e49432636b7ee9b83ae0e65`.
The simulator captures are:

- `power-hour-workout.webp` was freshly captured on 2026-10-18 from a build of
  that checkout, in a clean iPhone 17 Pro simulator running iOS 27.0.
  Test mode was explicitly disabled (`testModeEnabled = false`). The app's
  existing debug launch controls started a normal workout and advanced to the
  rest after its first set (`--ui-test-start --ui-test-phase=5`); these controls
  do not enable Test mode. The actual header reads **Pull ups x 2**, **8 reps**.
  No simulated heart-rate readings or personal history were supplied.
  The 1206 × 2622 screenshot was resized to 708 × 1539 and compressed to WebP;
  its interface, text, and badges were not edited. The task-created simulator
  (`FA0FA773-E7B4-4AB3-B49F-642591AC584C`) was shut down and deleted afterwards.
- `docs/screenshots/pr-197-muscle-all-routines.png` → `power-hour-muscles.webp`.
  Muscle coverage for the bundled sample routines. Its source documentation
  identifies these as simulator captures with no personal history.

## iNAB

Captured from the real React application built in an isolated temporary output
folder from the local iNAB checkout at
`8ea98caa25f74c251874a88fa97db4e84e037b6d`.

`dashboard-app/scripts/build-api-fixture.py` creates fictional rows in a temporary
SQLite database and projects them through the app's finance API contract. For
the portfolio captures, its seed rows were replaced in a temporary copy with
24 fictional months (October 2024–September 2026): varied salary and spending,
regular investment contributions, gains and drawdowns, six holdings, and
matching balances. Net worth is the sum of cash, credit and investments in each
month; monthly cash flow agrees with the fictional transaction ledger.

The refreshed 1440 × 1200 captures were taken on 2026-10-18. Home shows the
all-time net worth trend, positions, progress indicators and spending map;
Budget shows the plan comparison and cash flow by pay period. The actual
frontend rendered every chart and number; no interface text or chart pixels
were edited in the images.

The browser's dashboard requests were intercepted and fulfilled with that synthetic
payload; optional API calls were answered as unconfigured, and nonlocal requests
were blocked. No raw statements, private database, or real dashboard payload was
loaded. The captures show the Home and Budget workspaces with this sample data.

The capture captions on the public page explicitly identify the fictional data.

## Homelab

The architecture diagram is rendered locally from the configured design, with no
live cluster queries, deployment simulation, management endpoints, or credentials.

Source snapshots checked on 2026-10-18:

- `homelab` at `e25778a71c383dfb241d7c82970186fe92cd4151`:
  `ansible/hosts.ini` and `ansible/k3s.yml` define one Raspberry Pi control plane,
  two Pi workers, three Oracle Cloud workers and one Google Cloud worker.
  `AGENTS.md` and `README.md` identify the Pi models and Oracle ARM/x86 mix.
  The playbook joins all workers to the same server over Tailscale.
- `homelab/kubernetes/cluster.tf` bootstraps Argo CD, cert-manager and the Tailscale
  operator through Terraform. Ansible handles the node and k3s configuration;
  Traefik is the configured ingress controller.
- `homelab-deployments` at `aaaedb5caa944559b667e1dcf8e54a4208f2acc0`:
  `argo/finance`, `argo/media` and `argo/adguard` define the workload examples;
  `argo/signoz` and `argo/velero` provide observability and backups.

The cluster boundary contains all seven configured compute nodes. It describes
the architecture rather than reporting node availability. Public labels omit
internal hostnames, addresses, private repository URLs and storage identifiers.
