# Portfolio app captures

These are actual app interfaces, not rendered concept screens. Files under
`public/projects/` are compressed WebP copies; the originals are kept in their
owning project or in the local capture workspace. No personal financial data
is used in the iNAB screenshots.

## Power Hour

The source checkout was at `31891c412eeab3d35e49432636b7ee9b83ae0e65`.
The committed simulator captures are:

- `docs/previews/plasma-orb/active.png` → `power-hour-workout.webp`.
  A workout running in the app's explicitly marked Test mode.
- `docs/screenshots/pr-197-muscle-all-routines.png` → `power-hour-muscles.webp`.
  Muscle coverage for the bundled sample routines. Its source documentation
  identifies these as simulator captures with no personal history.

## iNAB

Captured from the real React application built in an isolated temporary output
folder from the local iNAB checkout at
`8ea98caa25f74c251874a88fa97db4e84e037b6d`.

`dashboard-app/scripts/build-api-fixture.py` creates fictional rows in a temporary
SQLite database and projects them through the app's finance API contract. The
browser's dashboard requests were intercepted and fulfilled with that synthetic
payload; optional API calls were answered as unconfigured, and nonlocal requests
were blocked. No raw statements, private database, or real dashboard payload was
loaded. The captures show the Home and Budget workspaces with this sample data.

The capture captions on the public page explicitly identify the fictional data.

## Homelab

The site uses an interactive architecture diagram based on the source repository,
rather than a screenshot of an authenticated management console. Its simulation
is labeled as an illustration and does not fetch live status or deploy anything.
