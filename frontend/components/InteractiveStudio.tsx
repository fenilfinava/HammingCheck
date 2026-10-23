"use client";

import React, { useState } from "react";
import BitFlipper from "./BitFlipper";
import InteractiveVenn from "./InteractiveVenn";
import { CheckCircle2, AlertTriangle, Zap, ShieldAlert } from "lucide-react";

export default function InteractiveStudio() {
  const [dataBits, setDataBits] = useState<number[]>([1, 0, 1, 1]);
  const [flippedPositions, setFlippedPositions] = useState<number[]>([]);

  // Compute 7-bit codeword
  const p1 = dataBits[0] ^ dataBits[1] ^ dataBits[3];
  const p2 = dataBits[0] ^ dataBits[2] ^ dataBits[3];
  const p4 = dataBits[1] ^ dataBits[2] ^ dataBits[3];
  const txCodeword = [p1, p2, dataBits[0], p4, dataBits[1], dataBits[2], dataBits[3]];

  // Received vector
  const rxVector = [...txCodeword];
  flippedPositions.forEach((pos) => {
    rxVector[pos - 1] ^= 1;
  });

  // Syndrome calculation S = H * r^T
  const s1 = rxVector[0] ^ rxVector[2] ^ rxVector[4] ^ rxVector[6];
  const s2 = rxVector[1] ^ rxVector[2] ^ rxVector[5] ^ rxVector[6];
  const s3 = rxVector[3] ^ rxVector[4] ^ rxVector[5] ^ rxVector[6];
  const syndromeBits = [s1, s2, s3];
  const syndromeDec = s1 * 1 + s2 * 2 + s3 * 4;

  // Corrected vector
  const correctedVector = [...rxVector];
  let correctedPos = 0;
  if (syndromeDec > 0) {
    correctedPos = syndromeDec;
    correctedVector[correctedPos - 1] ^= 1;
  }

  const decodedData = [correctedVector[2], correctedVector[4], correctedVector[5], correctedVector[6]];

  // Extended SECDED 8th bit
  const p0 = txCodeword.reduce((a, b) => a ^ b, 0);
  const rxP0 = p0;
  const overallParity = rxVector.reduce((a, b) => a ^ b, 0) ^ rxP0;

  const handleToggleDataBit = (index: number) => {
    const updated = [...dataBits];
    updated[index] ^= 1;
    setDataBits(updated);
  };

  const handleToggleCodewordBit = (pos: number) => {
    if (flippedPositions.includes(pos)) {
      setFlippedPositions(flippedPositions.filter((p) => p !== pos));
    } else {
      setFlippedPositions([...flippedPositions, pos]);
    }
  };

  const handleReset = () => {
    setDataBits([1, 0, 1, 1]);
    setFlippedPositions([]);
  };

  const handlePreset = (type: "clean" | "single" | "double" | "secded") => {
    setDataBits([1, 0, 1, 1]);
    if (type === "clean") {
      setFlippedPositions([]);
    } else if (type === "single") {
      setFlippedPositions([3]); // Bit 3 / d1
    } else if (type === "double") {
      setFlippedPositions([3, 5]); // Bit 3 (d1) & Bit 5 (d2)
    } else if (type === "secded") {
      setFlippedPositions([3, 5]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Grid: Bit Controls & Venn Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <BitFlipper
            dataBits={dataBits}
            codeword={txCodeword}
            rxVector={rxVector}
            flippedPositions={flippedPositions}
            correctedPos={correctedPos}
            onToggleDataBit={handleToggleDataBit}
            onToggleCodewordBit={handleToggleCodewordBit}
            onReset={handleReset}
            onPreset={handlePreset}
          />

          {/* Verdict Alert */}
          {flippedPositions.length === 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-900 text-base">
                  🟢 Pristine Channel (0 Errors Injected)
                </h4>
                <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                  Syndrome evaluates strictly to <b>[0, 0, 0]</b> (Decimal 0). Decoder takes no action.
                  Payload extracted with 100% integrity: <b>[{decodedData.join(", ")}]</b>.
                </p>
              </div>
            </div>
          )}

          {flippedPositions.length === 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
              <Zap className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-900 text-base">
                  🎯 Single Error Safely Corrected (SEC Verified)
                </h4>
                <p className="text-sm text-blue-800 mt-1 leading-relaxed">
                  Injected bit flip at <b>Position {flippedPositions[0]}</b>.
                  Syndrome evaluated to <b>Decimal {syndromeDec}</b>.
                  Decoder inverted the culprit bit. Original data <b>[{dataBits.join(", ")}]</b> 100% restored without data loss!
                </p>
              </div>
            </div>
          )}

          {flippedPositions.length === 2 && (
            <div className="bg-red-50 border border-red-300 rounded-2xl p-5 flex items-start gap-4 shadow-md">
              <AlertTriangle className="w-7 h-7 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-red-950 text-base flex items-center gap-2">
                  <span>🚨 DECODER ALIASING CATASTROPHE (Silent Corruption!)</span>
                </h4>
                <p className="text-sm text-red-900 mt-1 leading-relaxed">
                  Two bit errors injected at positions <b>[{flippedPositions.join(", ")}]</b>.
                  Ordinary Hamming(7,4) decoder assumes a SINGLE error occurred and calculated syndrome <b>{syndromeDec}</b>!
                  It mistakenly flipped innocent <b>Position {correctedPos}</b>.
                  Codeword now contains <b>3 CORRUPTED BITS</b>, and the receiver has ZERO awareness of the ruined data!
                </p>
              </div>
            </div>
          )}

          {flippedPositions.length > 2 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
              <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 text-base">
                  ⚠️ {flippedPositions.length} Multi-Bit Errors Injected
                </h4>
                <p className="text-sm text-amber-800 mt-1">
                  Exceeds Hamming distance capability. Decoder evaluated syndrome {syndromeDec}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Venn Diagram */}
        <div className="lg:col-span-5">
          <InteractiveVenn
            rxVector={rxVector}
            syndromeBits={syndromeBits}
            flippedPositions={flippedPositions}
            onToggleBit={handleToggleCodewordBit}
          />
        </div>
      </div>

      {/* Bottom Grid: Syndrome Mathematics & SECDED Protection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Syndrome Math Breakdown */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs anim-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>🧮 Live Syndrome Matrix Multiplication</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">S = H · rᵀ (mod 2)</p>
            </div>
            <span className="font-mono text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-black shadow-2xs">
              S = [{s1}, {s2}, {s3}] → Dec {syndromeDec}
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className={`p-3.5 rounded-xl border transition-all anim-card-sm flex flex-wrap items-center justify-between gap-2 ${
              s1 ? "bg-rose-50/80 border-rose-300 text-rose-950 shadow-xs" : "bg-slate-50/80 border-slate-200 text-slate-800"
            }`}>
              <div className="flex items-center gap-2">
                <span className="font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px]">Row 1 (s1):</span>
                <span>r1 ⊕ r3 ⊕ r5 ⊕ r7 = {rxVector[0]} ⊕ {rxVector[2]} ⊕ {rxVector[4]} ⊕ {rxVector[6]}</span>
              </div>
              <span className={`font-black px-2.5 py-1 rounded-lg border text-[11px] ${
                s1 ? "bg-rose-600 text-white border-rose-600 shadow-xs" : "bg-emerald-100 text-emerald-800 border-emerald-300"
              }`}>
                = {s1} {s1 ? "❌ FAIL" : "✔ PASS"}
              </span>
            </div>

            <div className={`p-3.5 rounded-xl border transition-all anim-card-sm flex flex-wrap items-center justify-between gap-2 ${
              s2 ? "bg-rose-50/80 border-rose-300 text-rose-950 shadow-xs" : "bg-slate-50/80 border-slate-200 text-slate-800"
            }`}>
              <div className="flex items-center gap-2">
                <span className="font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px]">Row 2 (s2):</span>
                <span>r2 ⊕ r3 ⊕ r6 ⊕ r7 = {rxVector[1]} ⊕ {rxVector[2]} ⊕ {rxVector[5]} ⊕ {rxVector[6]}</span>
              </div>
              <span className={`font-black px-2.5 py-1 rounded-lg border text-[11px] ${
                s2 ? "bg-rose-600 text-white border-rose-600 shadow-xs" : "bg-emerald-100 text-emerald-800 border-emerald-300"
              }`}>
                = {s2} {s2 ? "❌ FAIL" : "✔ PASS"}
              </span>
            </div>

            <div className={`p-3.5 rounded-xl border transition-all anim-card-sm flex flex-wrap items-center justify-between gap-2 ${
              s3 ? "bg-rose-50/80 border-rose-300 text-rose-950 shadow-xs" : "bg-slate-50/80 border-slate-200 text-slate-800"
            }`}>
              <div className="flex items-center gap-2">
                <span className="font-bold px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 text-[11px]">Row 3 (s3):</span>
                <span>r4 ⊕ r5 ⊕ r6 ⊕ r7 = {rxVector[3]} ⊕ {rxVector[4]} ⊕ {rxVector[5]} ⊕ {rxVector[6]}</span>
              </div>
              <span className={`font-black px-2.5 py-1 rounded-lg border text-[11px] ${
                s3 ? "bg-rose-600 text-white border-rose-600 shadow-xs" : "bg-emerald-100 text-emerald-800 border-emerald-300"
              }`}>
                = {s3} {s3 ? "❌ FAIL" : "✔ PASS"}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 text-xs text-indigo-950 flex flex-wrap items-center justify-between gap-2 anim-card-sm">
            <span className="font-mono">Decimal Formula: s1·(1) + s2·(2) + s3·(4) = {s1}·1 + {s2}·2 + {s3}·4</span>
            <span className="font-black font-mono text-sm px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white shadow-xs">
              = Culprit Bit {syndromeDec}
            </span>
          </div>
        </div>

        {/* SECDED Comparison */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs anim-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>🛡️ Extended SECDED Hamming(8,4) Status</span>
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                d_min = 4
              </span>
            </div>

            <p className="text-xs text-slate-500 my-3 leading-relaxed">
              Evaluates overall 8th parity bit <b>p0 = ⊕(all 7 bits) = {p0}</b> alongside the 3-bit syndrome:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-semibold">7-Bit Syndrome S:</span>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {syndromeDec} ({syndromeBits.join("")})
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-semibold">Overall 8-Bit Parity P:</span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded border ${
                  overallParity === 1 ? "bg-amber-50 text-amber-800 border-amber-300" : "bg-emerald-50 text-emerald-800 border-emerald-300"
                }`}>
                  {overallParity} ({overallParity === 1 ? "Odd / Single Error" : "Even / Double Error or Clean"})
                </span>
              </div>
            </div>
          </div>

          {/* SECDED Decision Badge */}
          <div className="pt-2">
            {flippedPositions.length === 2 ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 shadow-xs">
                <span className="font-extrabold block mb-1 text-emerald-800 flex items-center gap-1.5">
                  <span>✔ SECDED HALTED FALSE CORRECTION!</span>
                </span>
                <span className="text-emerald-900 leading-relaxed block">
                  Because S = {syndromeDec} ≠ 0 but Overall Parity P = 0, SECDED immediately detects a double error, refuses to invert innocent bit {syndromeDec}, and raises an uncorrectable interrupt!
                </span>
              </div>
            ) : flippedPositions.length === 1 ? (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 shadow-xs">
                <span className="font-extrabold block mb-1 text-blue-800">
                  ✔ SECDED Single Error Approved:
                </span>
                <span className="text-blue-900 leading-relaxed block">
                  S = {syndromeDec} ≠ 0 and P = 1 (Odd). Valid single error: safely repaired bit {syndromeDec}.
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium text-center">
                S = 0 and P = 0. Codeword verified pristine without noise.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
