/**
 * Keeps the seated cat fixed while her head and eyes follow the pointer.
 * @param {HTMLDivElement} root
 * @returns {() => void}
 */
export function startDeskCompanion(root) {
  const listeners = new AbortController();
  const catHome = root.querySelector("[data-cat-home]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let pointer = null,
    frame = 0,
    previous = 0,
    gazeX = 0,
    gazeY = 0,
    visible = true,
    disposed = false;
  const mix = (a, b, t) => a + (b - a) * t;

  function resetGaze() {
    gazeX = gazeY = 0;
    for (const key of ["--gx", "--gy", "--hx", "--hy"])
      catHome.style.setProperty(key, "0px");
    catHome.style.setProperty("--tilt", "0deg");
    catHome.style.setProperty("--head-scale-y", "1");
  }
  function resetPointer() {
    pointer = null;
    resetGaze();
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
    if (pointer && !reduced.matches) {
      const bounds = catHome.getBoundingClientRect();
      // Independent axes keep an upward glance clear even far across the page.
      const x = Math.tanh(
        (pointer.x - bounds.left - bounds.width * 0.5) /
          Math.max(bounds.width * 0.6, 90),
      );
      const y = Math.tanh(
        (pointer.y - bounds.top - bounds.height * 0.5) /
          Math.max(bounds.height * 0.5, 90),
      );
      gazeX = mix(gazeX, x, 1 - Math.exp(-dt * 9));
      gazeY = mix(gazeY, y, 1 - Math.exp(-dt * 9));
      catHome.style.setProperty("--gx", `${gazeX * 1.6}px`);
      catHome.style.setProperty("--gy", `${gazeY * 1.5}px`);
      catHome.style.setProperty("--hx", `${gazeX * 6}px`);
      catHome.style.setProperty("--hy", `${gazeY * 8}px`);
      catHome.style.setProperty("--tilt", `${gazeX * 18}deg`);
      catHome.style.setProperty("--head-scale-y", `${1 + gazeY * 0.06}`);
    } else {
      resetGaze();
    }
    frame = requestAnimationFrame(tick);
  }
  function resume() {
    previous = 0;
    if (!frame && !disposed && visible && !document.hidden)
      frame = requestAnimationFrame(tick);
  }
  function pause() {
    resetPointer();
    cancelAnimationFrame(frame);
    frame = 0;
  }
  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "touch" || reduced.matches) {
        resetPointer();
        return;
      }
      pointer = { x: event.clientX, y: event.clientY };
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
  window.addEventListener("scroll", resetPointer, {
    passive: true,
    signal: listeners.signal,
  });
  window.addEventListener("resize", resetPointer, { signal: listeners.signal });
  document.addEventListener(
    "visibilitychange",
    () => (document.hidden ? pause() : resume()),
    { signal: listeners.signal },
  );
  reduced.addEventListener("change", resetPointer, {
    signal: listeners.signal,
  });
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) resume();
      else pause();
    },
    { rootMargin: "80px" },
  );
  observer.observe(root);
  resume();
  return () => {
    disposed = true;
    listeners.abort();
    observer.disconnect();
    pause();
  };
}
