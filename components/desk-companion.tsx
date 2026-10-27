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
        aria-label="An engineer working at a laptop, with a seated tabby cat following the cursor with her head"
      >
        <svg viewBox="0 0 640 500" className="desk-art" aria-hidden="true">
          <defs>
            <linearGradient id="desk-cat-coat" x1="0" y1="0" x2=".25" y2="1">
              <stop stopColor="#726c63" />
              <stop offset=".45" stopColor="#a49a87" />
              <stop offset="1" stopColor="#827769" />
            </linearGradient>
            <linearGradient id="desk-cat-face" x1="0" y1="0" x2=".7" y2="1">
              <stop stopColor="#b5aa95" />
              <stop offset=".6" stopColor="#a09580" />
              <stop offset="1" stopColor="#887d6c" />
            </linearGradient>
            <linearGradient id="desk-cat-leg" x1="0" y1="0" x2="1" y2="0">
              <stop stopColor="#938672" />
              <stop offset=".65" stopColor="#b8aa92" />
              <stop offset="1" stopColor="#a0937e" />
            </linearGradient>
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
            <ellipse
              className="cat-contact-shadow"
              cx="99"
              cy="179"
              rx="39"
              ry="2.3"
              fill="#352b30"
              opacity=".17"
            />
            <g className="sit-rig">
              <g className="cat-tail">
                <path
                  d="M111 169C134 180 157 179 151 160Q147 150 154 144"
                  stroke="#8b8171"
                  strokeWidth="7"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M154 144q3-3 2-7"
                  stroke="#5d5951"
                  strokeWidth="5.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
              <path
                d="M80 113Q90 118 100 113L103 132H77Z"
                fill="url(#desk-cat-coat)"
              />
              <g className="cat-body">
                <path
                  d="M78 118C65 129 68 141 61 156Q55 168 65 175L76 178H112Q124 171 115 154C109 144 114 131 101 119Z"
                  fill="url(#desk-cat-coat)"
                />
                <path
                  d="M78 123Q89 131 101 122L98 143 95 171H82L80 143Z"
                  fill="#d0c3ab"
                />
                <path
                  d="M80 128l4 7 4-3 4 5 6-8"
                  stroke="#ece0c8"
                  strokeWidth="1"
                  fill="none"
                  opacity=".6"
                />
                <path
                  d="M70 148Q59 161 68 171L78 174M109 148Q120 163 109 174"
                  fill="none"
                  stroke="#736c60"
                  strokeWidth="1.3"
                />
                <path
                  d="M78 135Q74 153 76 171Q70 173 73 177H85Q89 176 85 171L86 137Z"
                  fill="url(#desk-cat-leg)"
                />
                <path
                  className="seated-front-paw"
                  d="M99 136Q98 151 100 171Q95 173 98 177H110Q114 175 108 171L106 135Z"
                  fill="url(#desk-cat-leg)"
                />
                <path
                  d="M76 175v2m4-2v2m21-2v2m4-2v2"
                  fill="none"
                  stroke="#776d5e"
                  strokeWidth=".6"
                />
                <path
                  d="M67 141q2 4 8 5m-12 4q4 5 10 5m-12 4q3 5 9 5m42-22-7 6m10 2-9 6m10 3-8 5M78 143l6 2m-7 6 6 2m17-9 7-2m-7 10 7-2"
                  stroke="#57584f"
                  strokeWidth="2"
                  fill="none"
                  opacity=".65"
                  strokeLinecap="round"
                />
              </g>
              <g className="cat-head seated-head">
                <g className="cat-ear ear-left">
                  <path d="M68 99Q64 84 69 73Q77 77 82 89Z" fill="#81796a" />
                  <path d="M70 80 72 94 78 88Z" fill="#b49c91" />
                  <path d="m70 80 2 12" stroke="#d3bfb0" strokeWidth=".8" />
                </g>
                <g className="cat-ear ear-right">
                  <path
                    d="M99 88Q105 77 113 74Q116 88 111 100Z"
                    fill="#777063"
                  />
                  <path d="M110 81 102 89 110 94Z" fill="#b49c91" />
                </g>
                <path
                  d="M68 98Q71 86 89 87Q107 86 112 99L114 109 109 111 110 116 105 116Q101 126 90 128Q77 126 73 117L68 116 70 111 65 109Z"
                  fill="url(#desk-cat-face)"
                />
                <path
                  d="M76 110Q83 108 89 116Q95 108 104 110L105 119Q98 127 90 127Q79 125 75 119Z"
                  fill="#d1c4ac"
                />
                <path
                  d="M85 96Q89 101 93 96L92 112 88 115 86 111Z"
                  fill="#b9ab91"
                />
                <g className="cat-blink">
                  <path
                    d="M72 102Q78 97 85 103Q80 108 75 105ZM95 103Q102 97 108 101L105 105Q99 108 95 103Z"
                    fill="#b2b38b"
                    stroke="#494b42"
                    strokeWidth=".9"
                  />
                  <g className="cat-eyes" fill="#30362f">
                    <ellipse cx="79" cy="103" rx="1.2" ry="2.8" />
                    <ellipse cx="101" cy="103" rx="1.2" ry="2.8" />
                  </g>
                  <path
                    d="M74 101l3-1m22 1 3-1"
                    stroke="#e4dcc5"
                    strokeWidth=".8"
                  />
                </g>
                <path d="m86 115 7 0q1 2-3.5 4-4-2-3.5-4" fill="#916f69" />
                <path
                  d="M89.5 119v3m0 0q-3 3-6 0m6 0q3 3 6 0"
                  fill="none"
                  stroke="#786c5e"
                  strokeWidth=".7"
                />
                <path
                  d="m78 116-19-3m19 6-20 1m21 2-17 5m39-11 19-4m-18 7 20 0m-20 3 17 4"
                  fill="none"
                  stroke="#e4dbca"
                  strokeWidth=".55"
                  opacity=".9"
                />
                <path
                  d="m77 91 5 5 2-5 5 6 5-6 2 5 6-5M70 108l7 3m-6 2 6 2m32-7-7 3m6 2-6 2"
                  fill="none"
                  stroke="#5d6053"
                  strokeWidth="1.6"
                  opacity=".8"
                  strokeLinecap="round"
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
    </div>
  );
}
