/**
 * Owns the desk cat's SVG rig and animation lifetime. The React component keeps
 * the drawing stable; this controller updates only its poses and hidden targets.
 * @param {HTMLDivElement} root
 * @returns {() => void}
 */
export function startDeskCompanion(root) {
  const listeners = new AbortController();
  let disposed = false;
  let visible = true;
  const catHome = root.querySelector("[data-cat-home]");
  const cat = root.querySelector("[data-cat]");
  const spotsLayer = root.querySelector(".pounce-spots");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  let spots = [],
    pointer = null,
    frame = 0,
    cooldown = 0,
    busy = false,
    flight = null,
    flyer = null;
  let catX = 520,
    facing = -1,
    idle = "look",
    idleTime = 0,
    walkTo = 520,
    sequence = 0,
    stridePhase = 0,
    walkSpeed = 0,
    gazeX = 0,
    gazeY = 0;
  let previous = 0,
    anticipation = 0,
    closeTime = 0,
    lastMove = 0;
  const smooth = (t) => t * t * (3 - 2 * t);
  const mix = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  // Keep the toes fixed and solve the elbow/knee from the shoulder or hip.
  const rigs = new WeakMap();
  function rig(svg) {
    if (!rigs.has(svg)) {
      const torso = svg.querySelector(".side-torso");
      rigs.set(svg, {
        torso,
        belly: torso.nextElementSibling,
        stripes: torso.nextElementSibling.nextElementSibling,
        head: svg.querySelector(".walking-head"),
        tail: [...svg.querySelectorAll(".side-tail path")],
        legs: Object.fromEntries(
          ["front-near", "front-far", "back-near", "back-far"].map((name) => [
            name,
            svg.querySelector("." + name),
          ]),
        ),
      });
    }
    return rigs.get(svg);
  }
  function articulate(
    svg,
    {
      frontDrop = 0,
      rearDrop = 0,
      feet = {},
      headDrop = frontDrop * 0.55,
      headPitch = 0,
      tailTwitch = 0,
    } = {},
  ) {
    const r = rig(svg),
      f = frontDrop,
      h = rearDrop;
    r.torso.setAttribute(
      "d",
      `M62 ${122 + f}C68 ${113 + f} 77 ${114 + f} 88 ${119 + (f + h) / 2}C104 ${124 + (f + h) / 2} 117 ${112 + h} 132 ${121 + h}Q148 ${129 + h} 143 ${146 + h}Q140 ${157 + h} 127 ${155 + h}C107 ${147 + (f + h) / 2} 91 ${153 + (f + h) / 2} 71 ${149 + f}Q58 ${144 + f} 62 ${122 + f}Z`,
    );
    r.belly.setAttribute(
      "d",
      `M69 ${145 + f}Q96 ${154 + (f + h) / 2} 125 ${149 + h}`,
    );
    r.stripes.setAttribute(
      "d",
      [
        [84, 120, 86, 133],
        [94, 119, 95, 130],
        [108, 120, 106, 131],
        [120, 122, 115, 132],
        [132, 126, 126, 135],
      ]
        .map(([x, y, a, b]) => {
          const d = mix(f, h, (x - 68) / 64);
          return `M${x} ${y + d}Q${a + 3} ${(y + b) / 2 + d} ${a} ${b + d}`;
        })
        .join(" "),
    );
    r.head.style.setProperty("--head-drop", headDrop + "px");
    r.head.style.setProperty("--head-pitch", headPitch + "deg");
    r.tail[0].setAttribute(
      "d",
      `M139 ${137 + h}C159 ${145 + h} 177 ${133 + tailTwitch * 0.5} 173 ${117 + tailTwitch}Q170 ${108 + tailTwitch} 176 ${106 + tailTwitch}`,
    );
    r.tail[1].setAttribute("d", `M176 ${106 + tailTwitch}q4-3 3-8`);
    for (const [name, rootX, rootY, footX, bend] of [
      ["front-near", 74, 137 + f, 70, -1],
      ["front-far", 69, 136 + f, 61, -1],
      ["back-near", 130, 138 + h, 119, 1],
      ["back-far", 126, 137 + h, 129, 1],
    ]) {
      const [x, y] = feet[name] || [footX, 177],
        dx = x - rootX,
        dy = y - rootY,
        d = Math.max(0.01, Math.hypot(dx, dy)),
        l1 = name.startsWith("front") ? 21 : 25,
        l2 = name.startsWith("front") ? 24 : 26;
      const length = clamp(d, 0.01, l1 + l2 - 0.01),
        along = (l1 * l1 - l2 * l2 + length * length) / (2 * length),
        side = Math.sqrt(Math.max(0, l1 * l1 - along * along));
      const kneeX = rootX + (along * dx) / d - (bend * side * dy) / d,
        kneeY = rootY + (along * dy) / d + (bend * side * dx) / d;
      const leg = r.legs[name];
      leg.style.transform = "none";
      // A tapered upper limb and lower leg, with a soft joint and a real paw.
      // The hind thigh is fuller; forelegs stay slender below the shoulder.
      const upper = name.startsWith("back") ? 7 : 4.4;
      const lower = 2.3;
      const n1x = -(kneeY - rootY) / l1,
        n1y = (kneeX - rootX) / l1;
      const n2x = -(y - kneeY) / l2,
        n2y = (x - kneeX) / l2;
      leg.firstElementChild.setAttribute(
        "d",
        `M${rootX + n1x * upper} ${rootY + n1y * upper}
         Q${kneeX + n1x * 4} ${kneeY + n1y * 4} ${kneeX + n2x * 3} ${kneeY + n2y * 3}
         L${x + n2x * lower} ${y + n2y * lower}
         Q${x} ${y + 2} ${x - n2x * lower} ${y - n2y * lower}
         L${kneeX - n2x * 3} ${kneeY - n2y * 3}
         Q${kneeX - n1x * 4} ${kneeY - n1y * 4} ${rootX - n1x * upper} ${rootY - n1y * upper}Z`,
      );
      leg.lastElementChild.setAttribute(
        "d",
        `M${x + 2} ${y - 3}Q${x - 2} ${y - 5} ${x - 6} ${y - 2}Q${x - 9} ${y + 1} ${x - 5} ${y + 1}H${x + 2}Q${x + 4} ${y} ${x + 2} ${y - 3}Z`,
      );

      leg.dataset.footX = x;
      leg.dataset.footY = y;
    }
  }
  function support(x) {
    // The keyboard is behind the upright lid, at desk height.
    if (x < 220 || x > 402) return 346;
    if (x < 245) return mix(346, 342, smooth((x - 220) / 25));
    if (x > 380) return mix(342, 346, smooth((x - 380) / 22));
    return 342;
  }
  function place() {
    catHome.style.left = ((catX - 81.6) / 640) * 100 + "%";
    catHome.style.top = ((support(catX) - 161.4) / 500) * 100 + "%";
  }
  function makeSpots() {
    const b = catHome.getBoundingClientRect(),
      origin = { x: b.left + b.width * 0.5, y: b.top + b.height * (177 / 210) };
    const angles = [-2.65, -0.75, 2.1];
    spots = angles.map((angle) => {
      const a = angle + (Math.random() - 0.5) * 0.35,
        reach = b.width * (0.85 + Math.random() * 0.4);
      return {
        x: clamp(origin.x + Math.cos(a) * reach, 48, innerWidth - 48),
        y: clamp(
          origin.y + Math.sin(a) * reach,
          110,
          Math.max(130, innerHeight - 125),
        ),
      };
    });
    spotsLayer.replaceChildren(
      ...spots.map((spot, i) => {
        const dot = document.createElement("span");
        dot.className = "pounce-marker";
        dot.style.left = spot.x + "px";
        dot.style.top = spot.y + "px";
        dot.textContent = String(i + 1);
        return dot;
      }),
    );
  }

  function resetGaze() {
    for (const key of ["--gx", "--gy", "--hx", "--hy"])
      catHome.style.setProperty(key, "0px");
    catHome.style.setProperty("--tilt", "0deg");
    gazeX = gazeY = 0;
  }
  function resetPointer() {
    pointer = null;
    closeTime = 0;
    resetGaze();
  }
  function pose(name) {
    catHome.dataset.pose = name;
    catHome.dataset.activity = name;
    catHome.classList.toggle("licking", name === "groom");
  }
  function look(time, dt) {
    const b = catHome.getBoundingClientRect();
    let dx = Math.sin(time * 0.0006) * 0.55,
      dy = 0.1;
    if (pointer && time - lastMove < 2500) {
      const x =
          (pointer.x - b.left - b.width * 0.5) / Math.max(b.width * 1.2, 180),
        y = (pointer.y - b.top - b.height * 0.4) / Math.max(b.height, 160),
        d = Math.max(1, Math.hypot(x, y));
      dx = x / d;
      dy = y / d;
    }
    // Eyes lead; the heavier head catches up with a damped, smaller movement.
    gazeX = mix(gazeX, dx, 1 - Math.exp(-dt * 8));
    gazeY = mix(gazeY, dy, 1 - Math.exp(-dt * 8));
    const mirror =
      catHome.dataset.pose === "walk" || catHome.dataset.pose === "stalk"
        ? -facing
        : 1;
    catHome.style.setProperty("--gx", `${gazeX * 1.3 * mirror}px`);
    catHome.style.setProperty("--gy", `${gazeY * 0.7}px`);
    catHome.style.setProperty("--hx", `${gazeX * 1.6 * mirror}px`);
    catHome.style.setProperty("--hy", `${gazeY * 1.1}px`);
    catHome.style.setProperty("--tilt", `${gazeX * 5 * mirror}deg`);
  }
  function nextIdle() {
    sequence++;
    idle = ["look", "groom", "walk", "stand", "walk", "look", "groom", "walk"][
      sequence % 8
    ];
    idleTime = 0;
    if (idle === "walk") {
      const choices = [165, 293, 518].filter((x) => Math.abs(x - catX) > 70);
      walkSpeed = 0;
      walkTo = choices[Math.floor(Math.random() * choices.length)];
      facing = walkTo < catX ? -1 : 1;
    }
  }
  function setLegs(phase) {
    const feet = {};
    for (const [name, x, offset] of [
      ["front-near", 70, 0],
      ["back-near", 119, 0.18],
      ["front-far", 61, 0.5],
      ["back-far", 129, 0.68],
    ]) {
      const t = (((phase / (Math.PI * 2) + offset) % 1) + 1) % 1;
      if (t < 0.68) feet[name] = [x + mix(-12, 12, t / 0.68), 177];
      else {
        const u = (t - 0.68) / 0.32;
        feet[name] = [
          x + mix(12, -12, smooth(u)),
          177 - Math.sin(Math.PI * u) * 7,
        ];
      }
    }
    articulate(cat, {
      feet,
      frontDrop: Math.sin(phase * 2) * 0.65,
      rearDrop: Math.sin(phase * 2 - 0.8) * 0.8,
      headDrop: Math.sin(phase * 2) * 0.15,
      tailTwitch: Math.sin(phase * 0.5) * 4,
    });
  }

  function relaxRig() {
    catHome.style.setProperty("--stretch-x", "1");
    catHome.style.setProperty("--stretch-y", "1");
    catHome.style.setProperty("--compress-y", "0px");
  }
  function tick(time) {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    if (previous && time - previous < 32) {
      frame = requestAnimationFrame(tick);
      return;
    }
    const dt = Math.min((time - (previous || time)) / 1000, 0.05);
    previous = time;
    if (!busy && !reduced.matches) {
      const nearest = pointer
        ? Math.min(
            ...spots.map((s) => Math.hypot(pointer.x - s.x, pointer.y - s.y)),
          )
        : Infinity;
      const attention =
        performance.now() > cooldown ? clamp((150 - nearest) / 110, 0, 1) : 0;
      anticipation = mix(anticipation, attention, 1 - Math.exp(-dt * 7));
      if (anticipation > 0.035) {
        pose("stalk");
        if (pointer) {
          const b = catHome.getBoundingClientRect();
          facing = pointer.x < b.left + b.width * 0.5 ? -1 : 1;
        }
        cat.style.transform = `scaleX(${-facing})`;
        catHome.style.transform = "none";
        articulate(cat, {
          frontDrop: anticipation * 9,
          rearDrop: anticipation * 17,
          headDrop: anticipation * 4,
          headPitch: -anticipation * 3,
          tailTwitch: Math.sin(time * 0.012) * anticipation * 1.5,
        });
        closeTime =
          nearest < 38 ? closeTime + dt : Math.max(0, closeTime - dt * 2);
        if (closeTime > 0.48 && anticipation > 0.8 && pointer) {
          pounce({ ...pointer });
          closeTime = 0;
        }
      } else {
        relaxRig();
        closeTime = 0;
        idleTime += dt;
        if (idle === "walk") {
          pose("walk");
          cat.style.transform = `scaleX(${-facing})`;
          const remaining = Math.abs(walkTo - catX);
          const desiredSpeed = Math.min(32, Math.sqrt(remaining * 100));
          walkSpeed = mix(walkSpeed, desiredSpeed, 1 - Math.exp(-dt * 4));
          const step = Math.min(remaining, dt * walkSpeed);
          catX += Math.sign(walkTo - catX) * step;
          // One stride is 24 local units of planted contact / 68% stance.
          // Advancing by distance (not wall time) keeps paws fixed on the desk.
          stridePhase += (step / ((163.2 / 180) * (24 / 0.68))) * Math.PI * 2;
          place();
          setLegs(stridePhase);
          catHome.style.transform = "none";
          if (Math.abs(walkTo - catX) < 0.1) {
            idle = "settle";
            idleTime = 0;
            makeSpots();
          }
        } else if (idle === "settle" || idle === "stand") {
          pose("walk");
          cat.style.transform = `scaleX(${-facing})`;
          const feet = {};
          // Finish the last step before standing, instead of snapping four paws.
          if (idle === "settle") {
            const t = smooth(clamp(idleTime / 0.3, 0, 1));
            for (const [name, x] of [
              ["front-near", 70],
              ["front-far", 61],
              ["back-near", 119],
              ["back-far", 129],
            ]) {
              const leg = rig(cat).legs[name];
              feet[name] = [
                mix(Number(leg.dataset.footX) || x, x, t),
                mix(Number(leg.dataset.footY) || 177, 177, t),
              ];
            }
          }
          articulate(cat, {
            feet,
            frontDrop: Math.sin(time * 0.0018) * 0.3,
            tailTwitch: Math.sin(time * 0.002) * 5,
          });
          if (idleTime > 2.5) nextIdle();
        } else {
          pose(idle === "groom" ? "groom" : "sit");
          cat.style.transform = "none";
          catHome.style.transform = "none";
          if (idleTime > (idle === "groom" ? 3.2 : 3.8)) nextIdle();
        }
      }
      look(time, dt);
    } else if (!busy) {
      pose("sit");
      cat.style.transform = "none";
      catHome.style.transform = "none";
      relaxRig();
      resetGaze();
    }
    frame = requestAnimationFrame(tick);
  }
  function phase(duration, render, signal) {
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new Error("cancelled"));
        return;
      }
      let start = null,
        id = 0;
      const cancel = () => {
        cancelAnimationFrame(id);
        reject(new Error("cancelled"));
      };
      signal.addEventListener("abort", cancel, { once: true });
      function step(time) {
        if (start === null) start = time;
        const p = clamp((time - start) / duration, 0, 1);
        render(p);
        if (p < 1) id = requestAnimationFrame(step);
        else {
          signal.removeEventListener("abort", cancel);
          resolve();
        }
      }
      id = requestAnimationFrame(step);
    });
  }
  function airPose(svg, p) {
    const lift = Math.sin(Math.PI * p),
      reach = smooth(clamp((p - 0.4) / 0.5, 0, 1));
    articulate(svg, {
      frontDrop: mix(-7, 0, p),
      rearDrop: mix(-3, -6, p),
      headDrop: -2,
      headPitch: mix(-8, 5, p),
      feet: {
        "front-near": [mix(43, 60, reach), mix(146, 177, reach)],
        "front-far": [mix(49, 61, reach), mix(150, 175, reach)],
        "back-near": [mix(140, 120, p), 174 - lift * 24],
        "back-far": [mix(145, 128, p), 172 - lift * 23],
      },
      tailTwitch: -lift * 10,
    });
  }
  async function leap(from, to, direction, signal) {
    const dx = to.x - from.x,
      dy = to.y - from.y,
      distance = Math.hypot(dx, dy);
    const duration = clamp(290 + distance * 0.48, 330, 510),
      arc = 28 + Math.abs(dy) * 0.28 + Math.min(Math.abs(dx) * 0.06, 20);
    const svg = flyer.firstElementChild;
    svg.style.transform = `scaleX(${-direction})`;
    await phase(
      duration,
      (p) => {
        flyer.style.transform = `translate3d(${mix(from.x, to.x, p)}px,${mix(from.y, to.y, p) - 4 * arc * p * (1 - p)}px,0)`;
        const pitch = direction * Math.sin(p * Math.PI * 2) * 5;
        svg.style.transform = `rotate(${pitch}deg) scaleX(${-direction})`;
        airPose(svg, p);
      },
      signal,
    );
    svg.style.transform = `scaleX(${-direction})`;
    root.dataset.catPhase = "landing";
    await phase(
      260,
      (p) => {
        const absorb = Math.sin(Math.PI * p),
          rear = smooth(clamp(p / 0.55, 0, 1));
        flyer.style.transform = `translate3d(${to.x}px,${to.y}px,0)`;
        articulate(svg, {
          frontDrop: absorb * 10,
          rearDrop: mix(-6, 0, rear) + absorb * 12,
          headDrop: absorb * 2,
          feet: {
            "front-near": [60, 177],
            "front-far": [61, 177],
            "back-near": [mix(125, 119, rear), mix(155, 177, rear)],
            "back-far": [129, mix(159, 177, rear)],
          },
        });
      },
      signal,
    );
  }
  async function windUp(svg, signal, starting = 0) {
    await phase(
      220,
      (p) => {
        const c = mix(starting, 1, smooth(p));
        articulate(svg, {
          frontDrop: c * 9,
          rearDrop: c * 17,
          headDrop: c * 4,
          tailTwitch: Math.sin(p * 14) * c,
        });
      },
      signal,
    );
    root.dataset.catPhase = "push-off";
    await phase(
      125,
      (p) => {
        const t = smooth(p);
        articulate(svg, {
          frontDrop: mix(9, -7, t),
          rearDrop: mix(17, -3, t),
          headDrop: mix(4, -2, t),
          feet: {
            "front-near": [mix(70, 43, t), mix(177, 146, t)],
            "front-far": [mix(61, 49, t), mix(177, 150, t)],
            "back-near": [119, 177],
            "back-far": [129, 177],
          },
        });
      },
      signal,
    );
  }
  async function pounce(target) {
    if (disposed || busy || !visible || document.hidden) return;
    if (reduced.matches) {
      return;
    }
    busy = true;
    const controller = new AbortController();
    flight = { cancel: () => controller.abort() };
    const bounds = catHome.getBoundingClientRect(),
      s = bounds.width / 180,
      direction = target.x < bounds.left + bounds.width * 0.5 ? -1 : 1;
    flyer = document.createElement("div");
    flyer.className = "desk-flight";
    flyer.dataset.pose = "flight";
    flyer.setAttribute("aria-hidden", "true");
    Object.assign(flyer.style, {
      left: bounds.left + "px",
      top: bounds.top + "px",
      width: bounds.width + "px",
      height: bounds.height + "px",
    });
    const copy = cat.cloneNode(true);
    copy.removeAttribute("data-cat");
    copy.style.transform = `scaleX(${-direction})`;
    flyer.append(copy);
    document.body.append(flyer);
    root.dataset.busy = "true";
    root.dataset.catPhase = "crouch";
    const targetPoint = {
      x: target.x - bounds.left - (direction < 0 ? 60 : 120) * s,
      y: target.y - bounds.top - 177 * s,
    };
    try {
      await windUp(copy, controller.signal, anticipation);
      root.dataset.catPhase = "outbound";
      await leap({ x: 0, y: 0 }, targetPoint, direction, controller.signal);
      root.dataset.catPhase = "caught";
      await phase(
        1050,
        (p) => {
          articulate(copy, {
            headDrop: Math.sin(Math.PI * p) * 4,
            headPitch: Math.sin(Math.PI * p) * 7,
            feet: {
              "front-near": [60, 177],
              "front-far": [61, 177],
              "back-near": [119, 177],
              "back-far": [129, 177],
            },
            tailTwitch: Math.sin(p * 9) * 2,
          });
        },
        controller.signal,
      );
      root.dataset.catPhase = "turn";
      flyer.dataset.pose = "sit";
      copy.style.transform = "none";
      await phase(380, () => {}, controller.signal);
      flyer.dataset.pose = "flight";
      copy.style.transform = `scaleX(${direction})`;
      root.dataset.catPhase = "return-crouch";
      await windUp(copy, controller.signal);
      const current = catHome.getBoundingClientRect(),
        destination = {
          x: current.left - bounds.left,
          y: current.top - bounds.top,
        };
      root.dataset.catPhase = "return";
      await leap(targetPoint, destination, -direction, controller.signal);
    } catch (error) {
      if (!controller.signal.aborted) console.error(error);
    } finally {
      flyer?.remove();
      flyer = null;
      flight = null;
      if (disposed) return;
      busy = false;
      anticipation = 0;
      closeTime = 0;
      root.dataset.busy = "false";
      root.dataset.catPhase = "idle";
      cooldown = performance.now() + 6500;
      // Keep the landing orientation and settle the forepaws before resting.
      // Switching straight to the seated rig made the return look like a cut.
      idle = "settle";
      idleTime = 0;
      facing = -direction;
      pose("walk");
      cat.style.transform = `scaleX(${-facing})`;
      catHome.style.transform = "none";
      relaxRig();
      articulate(cat, {
        feet: { "front-near": [60, 177], "front-far": [61, 177] },
      });
      resetGaze();
      makeSpots();
    }
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "touch" || reduced.matches) {
        resetPointer();
        return;
      }
      pointer = { x: event.clientX, y: event.clientY };
      lastMove = performance.now();
    },
    { passive: true, signal: listeners.signal },
  );
  window.addEventListener(
    "pointerout",
    (event) => {
      if (event.relatedTarget === null) resetPointer();
    },
    { signal: listeners.signal },
  );
  window.addEventListener("blur", resetPointer, { signal: listeners.signal });
  window.addEventListener(
    "scroll",
    () => {
      closeTime = 0;
      if (!busy && anticipation < 0.05) makeSpots();
    },
    { passive: true, signal: listeners.signal },
  );
  window.addEventListener(
    "resize",
    () => {
      flight?.cancel();
      place();
      makeSpots();
      resetPointer();
    },
    { signal: listeners.signal },
  );
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        resetPointer();
        flight?.cancel();
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        previous = 0;
        if (!frame) frame = requestAnimationFrame(tick);
      }
    },
    { signal: listeners.signal },
  );
  reduced.addEventListener(
    "change",
    () => {
      resetPointer();
      if (reduced.matches) flight?.cancel();
    },
    { signal: listeners.signal },
  );
  root
    .querySelector(".desk-call")
    .addEventListener(
      "click",
      () => pounce(spots[Math.floor(Math.random() * spots.length)]),
      { signal: listeners.signal },
    );
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        resetPointer();
        flight?.cancel();
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!document.hidden) {
        previous = 0;
        makeSpots();
        if (!frame) frame = requestAnimationFrame(tick);
      }
    },
    { rootMargin: "80px" },
  );
  observer.observe(root);
  place();
  makeSpots();
  frame = requestAnimationFrame(tick);
  return () => {
    disposed = true;
    listeners.abort();
    observer.disconnect();
    flight?.cancel();
    cancelAnimationFrame(frame);
    flyer?.remove();
    busy = false;
    anticipation = 0;
    catX = 520;
    place();
    pose("sit");
    resetPointer();
    articulate(cat);
    cat.style.transform = "none";
    catHome.style.transform = "none";
    root.dataset.busy = "false";
    spotsLayer.replaceChildren();
  };
}
