"use client";
import { useRef, useState, type PointerEvent } from "react";
import { usePreferences } from "./preferences";

export function Mascot() {
  const stage = useRef<HTMLButtonElement>(null);
  const [wave, setWave] = useState(0);
  const { motion } = usePreferences();
  const look = (event: PointerEvent<HTMLButtonElement>) => {
    if (!motion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    stage.current?.style.setProperty(
      "--look-x",
      `${((event.clientX - bounds.left) / bounds.width - 0.5) * 8}px`,
    );
    stage.current?.style.setProperty(
      "--look-y",
      `${((event.clientY - bounds.top) / bounds.height - 0.5) * 6}px`,
    );
  };
  return (
    <button
      ref={stage}
      className="mascot-stage"
      type="button"
      aria-label="Wave to the mascot"
      onClick={() => setWave((value) => value + 1)}
      onPointerMove={look}
      onPointerLeave={() => {
        stage.current?.style.setProperty("--look-x", "0px");
        stage.current?.style.setProperty("--look-y", "0px");
      }}
    >
      <svg viewBox="0 0 480 480" aria-hidden="true" className="mascot-scene">
        <defs>
          <linearGradient id="shell" x1="0" y1="0" x2="0.85" y2="1">
            <stop offset="0" stopColor="#c5775d" />
            <stop offset="0.48" stopColor="#8c241b" />
            <stop offset="1" stopColor="#580e0b" />
          </linearGradient>
          <linearGradient id="belly" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#e2b397" />
            <stop offset="1" stopColor="#b67c62" />
          </linearGradient>
          <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#fff5e6" />
            <stop offset="1" stopColor="#ebd0b5" />
          </linearGradient>
          <filter id="bot-shadow" x="-35%" y="-25%" width="170%" height="165%">
            <feDropShadow
              dx="0"
              dy="12"
              stdDeviation="10"
              floodColor="#4e0c08"
              floodOpacity="0.16"
            />
          </filter>
        </defs>
        <g
          className="mascot-orbit"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <ellipse
            cx="240"
            cy="248"
            rx="196"
            ry="135"
            transform="rotate(-28 240 248)"
            strokeDasharray="2 9"
          />
          <path d="M74 344 Q45 162 240 86 Q395 40 423 222" />
        </g>
        <g className="mascot-star star-one" transform="translate(89 138)">
          <path
            d="M0 -14 Q2 -2 14 0 Q2 2 0 14 Q-2 2 -14 0 Q-2 -2 0 -14Z"
            fill="currentColor"
          />
        </g>
        <g className="mascot-star star-two" transform="translate(383 192)">
          <path
            d="M0 -11 Q2 -2 11 0 Q2 2 0 11 Q-2 2 -11 0 Q-2 -2 0 -11Z"
            fill="currentColor"
          />
        </g>
        <g className="mascot-star star-three" transform="translate(343 82)">
          <path
            d="M0 -7 Q1 -1 7 0 Q1 1 0 7 Q-1 1 -7 0 Q-1 -1 0 -7Z"
            fill="currentColor"
          />
        </g>
        <g
          className="mascot-cube cube-one"
          transform="translate(77 290)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <path d="M0 -13 12 -6 12 8 0 15 -12 8 -12 -6Z M-12 -6 0 1 12 -6 M0 1V15" />
        </g>
        <g
          className="mascot-cube cube-two"
          transform="translate(378 348)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <path d="M0 -10 9 -5 9 6 0 11 -9 6 -9 -5Z M-9 -5 0 0 9 -5 M0 0V11" />
        </g>
        <ellipse className="mascot-shadow" cx="242" cy="421" rx="92" ry="12" />
        <g className="mascot-bot" filter="url(#bot-shadow)">
          <path
            d="M217 370 204 402 Q195 416 182 405 L179 401 Q177 395 183 385 L190 365"
            fill="#702018"
          />
          <path
            d="M264 370 278 401 Q287 415 300 404 L303 400 Q305 394 298 384 L290 365"
            fill="#702018"
          />
          <path
            d="M165 305 136 304 Q124 305 117 295 L106 281"
            fill="none"
            stroke="#9f4a34"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <circle cx="102" cy="274" r="16" fill="url(#belly)" />
          <g key={wave} className="mascot-wave">
            <path
              d="M316 306 Q350 304 354 274 L356 255"
              fill="none"
              stroke="#9f4a34"
              strokeWidth="22"
              strokeLinecap="round"
            />
            <rect
              x="341"
              y="222"
              width="32"
              height="39"
              rx="15"
              fill="url(#belly)"
              transform="rotate(12 357 242)"
            />
            <path
              d="M351 228 351 239 M358 227 358 239 M365 230 365 241"
              fill="none"
              stroke="#90513d"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
          <rect
            x="164"
            y="282"
            width="153"
            height="101"
            rx="37"
            fill="url(#shell)"
          />
          <rect
            x="190"
            y="303"
            width="101"
            height="61"
            rx="23"
            fill="url(#belly)"
          />
          <path
            d="M231 322 220 333 231 344 M250 322 261 333 250 344"
            fill="none"
            stroke="#6c231a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M237 145 237 121"
            fill="none"
            stroke="#a3543d"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle
            className="mascot-antenna"
            cx="237"
            cy="114"
            r="10"
            fill="#e2b397"
          />
          <rect
            x="139"
            y="145"
            width="203"
            height="154"
            rx="55"
            fill="url(#shell)"
          />
          <path
            d="M159 171 Q173 155 196 155H281"
            fill="none"
            stroke="#f5b999"
            strokeOpacity="0.35"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect
            x="159"
            y="172"
            width="163"
            height="104"
            rx="35"
            fill="url(#face)"
          />
          <g className="mascot-look">
            <g className="mascot-blink" fill="#61291e">
              <ellipse cx="208" cy="215" rx="8" ry="11" />
              <ellipse cx="274" cy="215" rx="8" ry="11" />
            </g>
            <path
              d="M226 245 Q241 258 256 245"
              fill="none"
              stroke="#61291e"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
          <ellipse
            cx="187"
            cy="241"
            rx="9"
            ry="5"
            fill="#c57961"
            opacity="0.25"
          />
          <ellipse
            cx="294"
            cy="241"
            rx="9"
            ry="5"
            fill="#c57961"
            opacity="0.25"
          />
          <circle cx="153" cy="223" r="4" fill="#f0c7a7" opacity="0.7" />
          <circle cx="329" cy="223" r="4" fill="#f0c7a7" opacity="0.7" />
        </g>
      </svg>
    </button>
  );
}
