"use client";

import React from "react";
import { RefreshCw, Zap, ShieldAlert, Sparkles } from "lucide-react";

interface BitFlipperProps {
  dataBits: number[];
  codeword: number[];
  rxVector: number[];
  flippedPositions: number[];
  correctedPos: number;
  onToggleDataBit: (index: number) => void;
  onToggleCodewordBit: (pos: number) => void;
  onReset: () => void;
  onPreset: (type: "clean" | "single" | "double" | "secded") => void;
}

export default function BitFlipper({
  dataBits,
  codeword,
  rxVector,
  flippedPositions,
  correctedPos,
  onToggleDataBit,
  onToggleCodewordBit,
  onReset,
  onPreset,
}: BitFlipperProps) {
  const roles = [
    { pos: 1, name: "p1", type: "parity", desc: "{1,3,5,7}" },
    { pos: 2, name: "p2", type: "parity", desc: "{2,3,6,7}" },
    { pos: 3, name: "d1", type: "data", desc: "Data 1" },
    { pos: 4, name: "p4", type: "parity", desc: "{4,5,6,7}" },
    { pos: 5, name: "d2", type: "data", desc: "Data 2" },
    { pos: 6, name: "d3", type: "data", desc: "Data 3" },
    { pos: 7, name: "d4", type: "data", desc: "Data 4" },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Quick Presets with Modern Styling */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Quick Simulation Presets:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onPreset("clean")}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition shadow-2xs active:scale-95"
          >
            🟢 Clean Channel
          </button>
          <button
            onClick={() => onPreset("single")}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition shadow-2xs active:scale-95"
          >
            🔵 Single Error (Bit 3)
          </button>
          <button
            onClick={() => onPreset("double")}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition shadow-2xs active:scale-95"
          >
            🔴 Double Error (Bits 3 &amp; 5)
          </button>
          <button
            onClick={onReset}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition shadow-2xs active:scale-95"
            title="Reset to default payload"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4-Bit Data Vector Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>1. Transmitted 4-Bit Payload</span>
            <span className="text-[10px] text-slate-400 font-normal font-sans">(click any bit to toggle)</span>
          </label>
          <span className="text-xs text-indigo-700 font-mono font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            d = [{dataBits.join(", ")}] (Dec: {dataBits[0] * 8 + dataBits[1] * 4 + dataBits[2] * 2 + dataBits[3]})
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {dataBits.map((bit, idx) => (
            <button
              key={idx}
              onClick={() => onToggleDataBit(idx)}
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-300 transition-all duration-200 group shadow-xs active:scale-97 cursor-pointer"
            >
              <span className="text-[11px] text-slate-500 group-hover:text-indigo-700 font-bold mb-1">
                Data Bit d{idx + 1}
              </span>
              <span className="text-2xl font-mono font-black text-indigo-700 group-hover:scale-110 transition-transform">
                {bit}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 7-Bit Codeword & Channel Flips */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>2. 7-Bit Channel Codeword</span>
            <span className="text-[10px] text-slate-400 font-normal font-sans">(click any pill to inject bit flip)</span>
          </label>
          <span className="text-xs font-mono font-bold text-slate-600">
            {flippedPositions.length === 0 ? (
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Pristine (0 Errors)
              </span>
            ) : flippedPositions.length === 1 ? (
              <span className="text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                1 Error at Bit [{flippedPositions[0]}]
              </span>
            ) : (
              <span className="text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                2 Errors at Bits [{flippedPositions.join(", ")}]
              </span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {roles.map((r, i) => {
            const isFlipped = flippedPositions.includes(r.pos);
            const isTargeted = correctedPos === r.pos;
            const rxVal = rxVector[i] ?? codeword[i];

            return (
              <button
                key={r.pos}
                onClick={() => onToggleCodewordBit(r.pos)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 relative shadow-xs active:scale-95 cursor-pointer ${
                  isFlipped
                    ? "bg-rose-50 border-rose-500 ring-2 ring-rose-400 shadow-md -translate-y-1"
                    : r.type === "parity"
                    ? "bg-blue-50/60 border-blue-200 hover:border-blue-400 hover:bg-blue-100/50"
                    : "bg-emerald-50/60 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/50"
                } ${isTargeted && !isFlipped ? "ring-2 ring-amber-500 ring-offset-2" : ""}`}
              >
                {/* Role label */}
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${
                    isFlipped
                      ? "text-rose-700"
                      : r.type === "parity"
                      ? "text-blue-700"
                      : "text-emerald-700"
                  }`}
                >
                  {r.name}
                </span>

                {/* Bit Value */}
                <span
                  className={`text-2xl font-mono font-black ${
                    isFlipped ? "text-rose-600 scale-110" : "text-slate-900"
                  }`}
                >
                  {rxVal}
                </span>

                {/* Position Footer */}
                <span className="text-[10px] text-slate-500 font-semibold mt-1">
                  Pos {r.pos}
                </span>

                {/* Decoder Fix Target Badge */}
                {isTargeted && (
                  <span className="absolute -top-2.5 right-0 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                    FIX
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}