"use client";
import { useEffect, useRef } from "react";
import { usePreferences } from "./preferences";
import { startDeskCompanion } from "@/lib/desk-companion";
import "./desk-companion.css";

export function DeskCompanion() {
  const root = useRef<HTMLDivElement>(null);
  const { motion } = usePreferences();
  useEffect(() => {
    if (!root.current || !motion) return;
    return startDeskCompanion(root.current);
  }, [motion]);
  return (
    <div className="desk-companion" ref={root}>
      <div
        className="desk-scene"
        role="img"
        aria-label="An engineer working at a laptop, with a tabby cat exploring the desk behind it"
      >
        <svg viewBox="0 0 640 500" className="desk-art" aria-hidden="true">
          <defs>
            <linearGradient id="desk-hoodie" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#a65361" />
              <stop offset="1" stopColor="#60253c" />
            </linearGradient>
            <linearGradient id="desk-screen" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#4d3e52" />
              <stop offset="1" stopColor="#2a2438" />
            </linearGradient>
            <linearGradient id="desk-wood" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#bd8c78" />
              <stop offset="1" stopColor="#986755" />
            </linearGradient>
          </defs>

          <path
            className="wall-line"
            d="M117 100H185M151 84V116M457 100H521M475 84V116"
          />
          <rect
            className="wall-note"
            x="433"
            y="123"
            width="52"
            height="39"
            rx="4"
            transform="rotate(7 459 142)"
          />
          <path className="note-ink" d="m446 139 7 7 14-14" />

          <rect
            x="208"
            y="223"
            width="172"
            height="180"
            rx="51"
            fill="#332a3c"
          />
          <path
            d="M226 395 208 468M364 395 383 468"
            stroke="#44384a"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M248 351 238 410 262 442M327 353 339 411 318 447"
            fill="none"
            stroke="#3d3248"
            strokeWidth="30"
            strokeLinecap="round"
          />
          <path
            d="m251 435-15 14q-10 12 7 15h33q10-3 3-12l-12-16M310 441l-8 16q-4 11 9 12h32q15-4 3-13l-19-17"
            fill="#cfad96"
          />

          <path
            d="M245 216Q279 196 313 217L342 234Q360 263 363 320L221 322Q218 259 233 233Z"
            fill="url(#desk-hoodie)"
          />
          <path
            d="M261 208Q287 239 315 208L325 228Q287 257 250 229Z"
            fill="#54253a"
          />
          <path d="M273 183V214Q287 228 302 212V182" fill="#b57d5c" />
          <path d="M273 196Q289 205 302 194V185H273Z" fill="#9a654e" />
          <path
            d="M263 235V267M316 236V265"
            stroke="#d7a59d"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <g className="engineer-head">
            <g transform="translate(17 10) scale(.94)">
              <path d="M274 186V211Q287 220 302 209V185" fill="#b47c5d" />
              <ellipse cx="254" cy="161" rx="5" ry="9" fill="#b47c5d" />
              <ellipse cx="320" cy="161" rx="5" ry="9" fill="#b47c5d" />
              <path
                d="M255 138Q256 111 282 110Q311 108 318 135L316 170Q311 192 289 201Q267 195 260 176Z"
                fill="#c6906b"
              />
              <path
                d="M306 123Q321 147 314 174Q309 190 291 198L299 183Q310 166 306 123Z"
                fill="#b17a5b"
                opacity=".4"
              />
              <path
                d="M252 154Q247 138 252 125Q258 107 275 106Q295 98 309 111Q325 117 320 151L315 150 312 131Q294 132 281 120Q272 131 258 133L257 155Z"
                fill="#302832"
              />
              <path
                d="M261 121Q273 109 286 111"
                fill="none"
                stroke="#51404a"
                strokeWidth="2"
                opacity=".6"
                strokeLinecap="round"
              />
              <path
                d="M264 151Q270 148 277 151M297 151Q304 149 310 153"
                fill="none"
                stroke="#4d3434"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M265 160Q270 158 276 160M298 160Q303 159 308 162"
                fill="none"
                stroke="#563a35"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <ellipse cx="272" cy="161" rx="1.8" ry="1.4" fill="#382b2e" />
              <ellipse cx="304" cy="162" rx="1.8" ry="1.4" fill="#382b2e" />
              <path
                d="M288 160 285 174Q289 177 293 174"
                fill="none"
                stroke="#a16a52"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M280 185Q287 187 295 184"
                fill="none"
                stroke="#8e5c4e"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M285 191H291"
                stroke="#b68060"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </g>
          </g>

          <path
            d="M237 249Q214 277 230 301L264 322M337 251Q359 277 342 302L311 323"
            fill="none"
            stroke="#965061"
            strokeWidth="25"
            strokeLinecap="round"
          />
          <g className="hand hand-left">
            <path
              d="m256 311 30 10q12 8 0 13h-28q-11-4-10-13Z"
              fill="#c6906b"
            />
            <path
              d="m265 320 14 4M263 326l16 3"
              stroke="#a16b54"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
          <g className="hand hand-right">
            <path d="m320 311-25 10q-13 8-1 13h29q11-4 8-13Z" fill="#c6906b" />
            <path
              d="m320 320-15 4M321 326l-17 3"
              stroke="#a16b54"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          <path
            d="M129 362 113 477M513 362 529 477"
            stroke="#986f60"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path d="M123 419H520" stroke="#76534d" strokeWidth="6" />
          <rect
            x="94"
            y="346"
            width="462"
            height="16"
            rx="7"
            fill="url(#desk-wood)"
          />
          <path
            d="M108 348H543"
            stroke="#d4ae95"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".55"
          />

          <rect x="152" y="313" width="30" height="32" rx="6" fill="#e5c7a9" />
          <path
            d="M181 319h7q12 13-6 18"
            stroke="#e5c7a9"
            strokeWidth="5"
            fill="none"
          />
          <path
            className="steam"
            d="M161 302q-6-8 0-15M173 303q-5-6 1-12"
            stroke="#c2a39b"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path d="m114 345-4-27h25l-5 27Z" fill="#bb8f9c" />
          <path
            d="M122 318v-27M123 310q-19-1-16-17 14-1 16 17M123 302q18 0 16-16-14-2-16 16"
            fill="#a78987"
            stroke="#a78987"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <div data-cat-home="" data-pose="sit">
          <svg data-cat="" viewBox="0 0 180 210" aria-hidden="true">
            <g className="sit-rig">
              <g className="cat-tail">
                <path
                  d="M109 170Q153 185 148 150Q143 127 155 119"
                  stroke="#80766b"
                  strokeWidth="7"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M155 119q-1-5 2-7"
                  stroke="#625c55"
                  strokeWidth="7"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
              <g className="cat-body">
                <path
                  d="M78 118Q62 128 62 151Q54 173 72 178L112 178Q125 171 115 151Q114 128 102 119Z"
                  fill="#938674"
                />
                <path
                  d="M81 126Q78 149 83 175H98Q104 146 99 126Z"
                  fill="#c6b8a2"
                />
                <path
                  d="M77 137 76 173Q75 177 83 177M104 137 103 173Q102 177 111 177"
                  fill="none"
                  stroke="#a99b88"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="m65 150 8 4m-9 5 7 4m41-16-7 5m9 3-8 4"
                  stroke="#716b5e"
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
              <g className="groom-paw">
                <path
                  d="M105 159Q111 137 104 128"
                  stroke="#a99b88"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />
                <ellipse cx="104" cy="127" rx="5" ry="4" fill="#cbbca5" />
              </g>
              <g className="cat-head seated-head">
                <path
                  d="M67 94 68 69 82 82Q90 78 99 82L113 70 113 96Z"
                  fill="#80766b"
                />
                <path d="m72 78 2 13 7-7M108 78l-2 13-7-7" fill="#b59c91" />
                <path
                  d="M66 102Q63 85 88 82Q114 83 115 102L110 117Q102 129 89 130Q75 127 69 116Z"
                  fill="#a99b88"
                />
                <path
                  d="M70 111Q79 109 89 117Q99 109 111 110L107 121Q89 134 73 121Z"
                  fill="#cbbca5"
                />
                <g className="cat-blink">
                  <path
                    d="M71 101q8-6 15 1-8 7-15-1M94 102q8-7 15-1-7 8-15 1"
                    fill="#c6b57b"
                    stroke="#625b51"
                    strokeWidth="1"
                  />
                  <g className="cat-eyes" fill="#30342d">
                    <ellipse cx="79" cy="102" rx="1.5" ry="4" />
                    <ellipse cx="101" cy="102" rx="1.5" ry="4" />
                  </g>
                </g>
                <path d="m85 117 8 0-4 4Z" fill="#765a56" />
                <path
                  d="M89 121v3m0 0-5 2m5-2 5 2"
                  fill="none"
                  stroke="#726659"
                  strokeWidth=".9"
                />
                <path
                  d="m75 116-18-2m18 5-19 3m48-6 19-2m-19 5 18 3"
                  fill="none"
                  stroke="#d5cabc"
                  strokeWidth=".7"
                  opacity=".7"
                />
                <path
                  d="m81 86 3 8m6-10v10m8-8-3 8"
                  fill="none"
                  stroke="#736d60"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  className="cat-tongue"
                  d="M90 124q2 7 5 4l-1-5"
                  fill="#bb8887"
                />
              </g>
            </g>
            <g className="side-rig">
              <g className="cat-tail side-tail">
                <path
                  d="M139 134Q170 133 164 108Q158 88 170 84"
                  fill="none"
                  stroke="#80766b"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <path
                  d="M170 84q3-2 2-6"
                  fill="none"
                  stroke="#625c55"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </g>
              <g className="leg back-far">
                <path d="M126 138 135 158 129 177" />
                <path className="toe" d="M129 177H123" />
              </g>
              <g className="leg front-far">
                <path d="M69 137 66 157 61 177" />
                <path className="toe" d="M61 177H55" />
              </g>
              <path
                className="side-torso"
                d="M62 120Q77 112 94 117Q113 116 132 122Q148 129 143 145Q139 159 123 158L94 153 70 149Q57 143 62 120Z"
                fill="#938674"
              />
              <path
                d="M69 145Q96 154 125 149"
                fill="none"
                stroke="#c6b8a2"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="m84 120 2 13m8-14 1 11m13-10-2 11m12-8-5 10m17-6-6 9"
                stroke="#716b5e"
                strokeWidth="2.8"
                fill="none"
                strokeLinecap="round"
              />
              <g className="leg back-near">
                <path d="M130 141 113 159 119 177" />
                <path className="toe" d="M119 177H113" />
              </g>
              <g className="leg front-near">
                <path d="M74 140 80 159 70 177" />
                <path className="toe" d="M70 177H64" />
              </g>
              <g className="cat-head walking-head">
                <path d="m38 103 1-23 14 14 11-6 3 22Z" fill="#80766b" />
                <path d="m42 88 1 12 7-4" fill="#b59c91" />
                <path
                  d="M39 99Q56 90 68 104L66 123Q59 135 43 131L32 124 23 119 29 111Z"
                  fill="#a99b88"
                />
                <path d="m25 117 16-3 9 7-6 9-14-6Z" fill="#cbbca5" />
                <path d="m23 116 6 0-2 4-5-1Z" fill="#765a56" />
                <g className="cat-blink">
                  <path
                    d="M37 108q7-5 13 0-7 6-13 0"
                    fill="#c6b57b"
                    stroke="#625b51"
                    strokeWidth="1"
                  />
                  <g className="cat-eyes" fill="#30342d">
                    <ellipse cx="43" cy="108" rx="1.4" ry="3.2" />
                  </g>
                </g>
                <path
                  d="m30 124 9 2m-7-6-18 1m20 3-18 4M57 99l-3 8m10-5-5 8"
                  fill="none"
                  stroke="#736d60"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="m34 123-16 5"
                  stroke="#d5cabc"
                  strokeWidth=".7"
                  fill="none"
                />
              </g>
            </g>
          </svg>
        </div>
        <svg
          className="laptop-foreground"
          viewBox="0 0 640 500"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="desk-laptop-lid" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#4d3e52" />
              <stop offset="1" stopColor="#2a2438" />
            </linearGradient>
          </defs>
          <g id="desk-laptop">
            <path
              d="m222 262 157 0q7 0 6 8l-16 72H237l-22-72q-2-8 7-8"
              fill="url(#desk-laptop-lid)"
              stroke="#796579"
              strokeWidth="2"
            />
            <path d="M232 340H375L385 346H219Z" fill="#ae9aa7" />
            <path
              d="m286 296-9 8 9 8M309 296l9 8-9 8"
              fill="none"
              stroke="#d9b3bf"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
      <button
        className="desk-call"
        type="button"
        disabled={!motion}
        aria-label="Call the cat"
      >
        Call the cat <span aria-hidden="true">↗</span>
      </button>
      <div className="pounce-spots" aria-hidden="true" />
    </div>
  );
}
