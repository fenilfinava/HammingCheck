"use client";

import React from "react";
import { Check, X, Info } from "lucide-react";

interface VennProps {
  rxVector: number[];
  syndromeBits: number[];
  flippedPositions: number[];
  onToggleBit: (pos: number) => void;
}

export default function InteractiveVenn({
  rxVector,
  syndromeBits,
  flippedPositions,
  onToggleBit,
}: VennProps) {
  // syndromeBits: [s1, s2, s3]
  const s1 = syndromeBits[0] === 1;
  const s2 = syndromeBits[1] === 1;
  const s3 = syndromeBits[2] === 1;

  // Nodes: pos 1..7 carefully calibrated
  const nodes = [
    { pos: 1, name: "p1", x: 120, y: 155, role: "Parity 1", isData: false },
    { pos: 2, name: "p2", x: 340, y: 155, role: "Parity 2", isData: false },
    { pos: 3, name: "d1", x: 230, y: 115, role: "Data 1", isData: true },
    { pos: 4, name: "p4", x: 230, y: 335, role: "Parity 4", isData: false },
    { pos: 5, name: "d2", x: 165, y: 245, role: "Data 2", isData: true },
    { pos: 6, name: "d3", x: 295, y: 245, role: "Data 3", isData: true },
    { pos: 7, name: "d4", x: 230, y: 200, role: "Data 4 (Center)", isData: true },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Title & Instructions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <span>🎯 Geometric Parity Venn Diagram</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Circles C1 (p1), C2 (p2), and C3 (p4) enforce even parity across their subsets
          </p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
          Click any node to flip bit
        </span>
      </div>

      {/* Circle Status Indicators */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div
          className={`p-2 rounded-xl border transition-all ${
            s1
              ? "bg-rose-50 border-rose-300 text-rose-900 font-bold shadow-xs"
              : "bg-blue-50/60 border-blue-200 text-blue-900 font-semibold"
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Circle 1 (p1)</div>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            {s1 ? <X className="w-3.5 h-3.5 text-rose-600" /> : <Check className="w-3.5 h-3.5 text-blue-600" />}
            <span>{s1 ? "Parity FAIL" : "Parity PASS"}</span>
          </div>
        </div>

        <div
          className={`p-2 rounded-xl border transition-all ${
            s2
              ? "bg-rose-50 border-rose-300 text-rose-900 font-bold shadow-xs"
              : "bg-emerald-50/60 border-emerald-200 text-emerald-900 font-semibold"
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Circle 2 (p2)</div>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            {s2 ? <X className="w-3.5 h-3.5 text-rose-600" /> : <Check className="w-3.5 h-3.5 text-emerald-600" />}
            <span>{s2 ? "Parity FAIL" : "Parity PASS"}</span>
          </div>
        </div>

        <div
          className={`p-2 rounded-xl border transition-all ${
            s3
              ? "bg-rose-50 border-rose-300 text-rose-900 font-bold shadow-xs"
              : "bg-violet-50/60 border-violet-200 text-violet-900 font-semibold"
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Circle 3 (p4)</div>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            {s3 ? <X className="w-3.5 h-3.5 text-rose-600" /> : <Check className="w-3.5 h-3.5 text-violet-600" />}
            <span>{s3 ? "Parity FAIL" : "Parity PASS"}</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="flex justify-center bg-gradient-to-b from-slate-50/80 to-white rounded-2xl p-3 border border-slate-200/70 shadow-inner">
        <svg viewBox="0 0 460 410" className="w-full max-w-md select-none">
          <defs>
            {/* Soft Shadows & Glows */}
            <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.12" />
            </filter>
            <filter id="errorGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#e11d48" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Circle 1 (p1): Top-Left */}
          <circle
            cx="180"
            cy="175"
            r="125"
            className="transition-all duration-300"
            fill={s1 ? "rgba(244, 63, 94, 0.12)" : "rgba(59, 130, 246, 0.08)"}
            stroke={s1 ? "#e11d48" : "#3b82f6"}
            strokeWidth={s1 ? "3" : "2"}
            strokeDasharray={s1 ? "6 4" : "none"}
          />

          {/* Circle 2 (p2): Top-Right */}
          <circle
            cx="280"
            cy="175"
            r="125"
            className="transition-all duration-300"
            fill={s2 ? "rgba(244, 63, 94, 0.12)" : "rgba(16, 185, 129, 0.08)"}
            stroke={s2 ? "#e11d48" : "#10b981"}
            strokeWidth={s2 ? "3" : "2"}
            strokeDasharray={s2 ? "6 4" : "none"}
          />

          {/* Circle 3 (p4): Bottom-Center */}
          <circle
            cx="230"
            cy="255"
            r="125"
            className="transition-all duration-300"
            fill={s3 ? "rgba(244, 63, 94, 0.12)" : "rgba(168, 85, 247, 0.08)"}
            stroke={s3 ? "#e11d48" : "#a855f7"}
            strokeWidth={s3 ? "3" : "2"}
            strokeDasharray={s3 ? "6 4" : "none"}
          />

          {/* Interactive Nodes */}
          {nodes.map((node) => {
            const isFlipped = flippedPositions.includes(node.pos);
            const bitVal = rxVector[node.pos - 1] ?? 0;

            return (
              <g
                key={node.pos}
                className="cursor-pointer group"
                onClick={() => onToggleBit(node.pos)}
              >
                {/* Outer animated aura if flipped */}
                {isFlipped && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.pos === 7 ? 27 : 24}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="animate-spin"
                    style={{ animationDuration: "6s" }}
                  />
                )}

                {/* Main Node Body */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.pos === 7 ? 22 : 19}
                  fill={isFlipped ? "#e11d48" : "#ffffff"}
                  stroke={
                    isFlipped
                      ? "#9f1239"
                      : node.isData
                      ? "#059669"
                      : "#2563eb"
                  }
                  strokeWidth={isFlipped ? "2.5" : "2"}
                  filter={isFlipped ? "url(#errorGlow)" : "url(#nodeShadow)"}
                  className="transition-transform group-hover:scale-110"
                />

                {/* Node Name Label */}
                <text
                  x={node.x}
                  y={node.y - 4}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isFlipped ? "#fecdd3" : "#64748b"}
                  fontWeight="bold"
                  fontSize="10"
                  className="pointer-events-none uppercase tracking-wider"
                >
                  {node.name}
                </text>

                {/* Node Value Label */}
                <text
                  x={node.x}
                  y={node.y + 7}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isFlipped ? "#ffffff" : "#0f172a"}
                  fontWeight="900"
                  fontFamily="monospace"
                  fontSize="13"
                  className="pointer-events-none"
                >
                  {bitVal}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-100" /> Parity (p1, p2, p4)
        </span>
        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-100" /> Data (d1..d4)
        </span>
        <span className="flex items-center gap-1.5 font-semibold text-rose-700">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-rose-100 animate-pulse" /> Injected Error
        </span>
      </div>
    </div>
  );
}