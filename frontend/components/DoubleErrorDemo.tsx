"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle, ShieldAlert, Zap, Layers, RefreshCw } from "lucide-react";

export default function DoubleErrorDemo() {
  const [dataBits] = useState<number[]>([1, 0, 1, 1]);
  const [singleFlipPos, setSingleFlipPos] = useState<number>(3); // Bit 3
  const [doubleFlipPair, setDoubleFlipPair] = useState<[number, number]>([3, 5]); // Bits 3 and 5

  // Codeword
  const p1 = dataBits[0] ^ dataBits[1] ^ dataBits[3];
  const p2 = dataBits[0] ^ dataBits[2] ^ dataBits[3];
  const p4 = dataBits[1] ^ dataBits[2] ^ dataBits[3];
  const txCodeword = [p1, p2, dataBits[0], p4, dataBits[1], dataBits[2], dataBits[3]];

  // --- CASE A: SINGLE ERROR ---
  const rxSingle = [...txCodeword];
  rxSingle[singleFlipPos - 1] ^= 1;
  const s1_single = rxSingle[0] ^ rxSingle[2] ^ rxSingle[4] ^ rxSingle[6];
  const s2_single = rxSingle[1] ^ rxSingle[2] ^ rxSingle[5] ^ rxSingle[6];
  const s3_single = rxSingle[3] ^ rxSingle[4] ^ rxSingle[5] ^ rxSingle[6];
  const synDec_single = s1_single * 1 + s2_single * 2 + s3_single * 4;
  const corrected_single = [...rxSingle];
  if (synDec_single > 0) corrected_single[synDec_single - 1] ^= 1;
  const singleRestored = [corrected_single[2], corrected_single[4], corrected_single[5], corrected_single[6]];

  // --- CASE B: DOUBLE ERROR ---
  const rxDouble = [...txCodeword];
  rxDouble[doubleFlipPair[0] - 1] ^= 1;
  rxDouble[doubleFlipPair[1] - 1] ^= 1;
  const s1_double = rxDouble[0] ^ rxDouble[2] ^ rxDouble[4] ^ rxDouble[6];
  const s2_double = rxDouble[1] ^ rxDouble[2] ^ rxDouble[5] ^ rxDouble[6];
  const s3_double = rxDouble[3] ^ rxDouble[4] ^ rxDouble[5] ^ rxDouble[6];
  const synDec_double = s1_double * 1 + s2_double * 2 + s3_double * 4;
  const corrected_double = [...rxDouble];
  if (synDec_double > 0) corrected_double[synDec_double - 1] ^= 1;
  const doubleRestored = [corrected_double[2], corrected_double[4], corrected_double[5], corrected_double[6]];

  // SECDED overall parity
  const p0 = txCodeword.reduce((a, b) => a ^ b, 0);
  const overallParitySingle = rxSingle.reduce((a, b) => a ^ b, 0) ^ p0;
  const overallParityDouble = rxDouble.reduce((a, b) => a ^ b, 0) ^ p0;

  // H matrix columns (1-indexed 1..7)
  const H_cols: Record<number, number[]> = {
    1: [1, 0, 0],
    2: [0, 1, 0],
    3: [1, 1, 0],
    4: [0, 0, 1],
    5: [1, 0, 1],
    6: [0, 1, 1],
    7: [1, 1, 1],
  };

  const colI = H_cols[doubleFlipPair[0]];
  const colJ = H_cols[doubleFlipPair[1]];
  const sumCol = [colI[0] ^ colJ[0], colI[1] ^ colJ[1], colI[2] ^ colJ[2]];
  const aliasedK = sumCol[0] * 1 + sumCol[1] * 2 + sumCol[2] * 4;

  const bitName = (p: number) => {
    return p === 1 ? "p1" : p === 2 ? "p2" : p === 3 ? "d1" : p === 4 ? "p4" : `d${p - 2}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-tr from-rose-50 to-rose-100 text-rose-600 rounded-2xl border border-rose-200 shadow-2xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Single Error vs. Double Error: The Aliasing Catastrophe
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              Side-by-side comparison of 1-bit error recovery vs. 2-bit decoder failure and silent data corruption.
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Clean Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Case A (Single Error) */}
        <div className="bg-white border-2 border-emerald-300/90 hover:border-emerald-400 rounded-2xl p-6 shadow-xs anim-card flex flex-col justify-between space-y-5">
          {/* Top Title & Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Case A: Single Error</h3>
                <span className="text-[11px] text-slate-500 font-medium">1 Bit Injected Flip</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
              ✔ 100% Corrected
            </span>
          </div>

          {/* Selector */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
            <label className="text-xs font-bold text-emerald-950 block">Select 1 Bit to Flip:</label>
            <div className="grid grid-cols-7 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                <button
                  key={p}
                  onClick={() => setSingleFlipPos(p)}
                  className={`py-1.5 rounded-lg text-xs font-black font-mono transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    singleFlipPos === p
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-emerald-100/60"
                  }`}
                >
                  {bitName(p)}
                </button>
              ))}
            </div>
          </div>

          {/* Key-Value Metrics Grid */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 anim-card-sm">
              <span className="text-slate-600 font-semibold">Injected Error:</span>
              <span className="font-mono font-bold text-slate-900">
                Position {singleFlipPos} ({bitName(singleFlipPos)})
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 anim-card-sm">
              <span className="text-slate-600 font-semibold">Calculated Syndrome:</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                [{s1_single}, {s2_single}, {s3_single}] → Dec {synDec_single}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 anim-card-sm">
              <span className="text-slate-600 font-semibold">Decoder Action:</span>
              <span className="font-bold text-emerald-800">Inverts Bit {synDec_single} back</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 anim-card-sm">
              <span className="text-slate-600 font-semibold">Extracted Payload:</span>
              <span className="font-mono font-bold text-emerald-800">
                [{singleRestored.join(", ")}] (100% Match!)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 anim-card-sm">
              <span className="text-slate-600 font-semibold">Extended SECDED Parity:</span>
              <span className="font-mono font-bold text-emerald-700">
                P = {overallParitySingle} (Odd / Single Error)
              </span>
            </div>
          </div>

          {/* Bottom Verdict Banner */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-950 flex items-start gap-3 shadow-2xs anim-card-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black block text-emerald-900">Guaranteed Recovery Verified</span>
              <span className="text-emerald-800 text-[11px] leading-relaxed">
                The syndrome strictly isolated corrupted position {singleFlipPos}. Payload is completely restored without loss.
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Case B (Double Error) */}
        <div className="bg-white border-2 border-rose-300/90 hover:border-rose-400 rounded-2xl p-6 shadow-xs anim-card flex flex-col justify-between space-y-5">
          {/* Top Title & Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-rose-100">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-xs" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Case B: Double Error</h3>
                <span className="text-[11px] text-slate-500 font-medium">2 Bits Injected Flips</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
              🚨 Miscorrection Catastrophe
            </span>
          </div>

          {/* Pair Preset Selector */}
          <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 space-y-2">
            <label className="text-xs font-bold text-rose-950 block">Select 2-Bit Error Pair:</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                [3, 5],
                [1, 2],
                [2, 6],
                [4, 7],
              ].map(([i, j]) => (
                <button
                  key={`${i}-${j}`}
                  onClick={() => setDoubleFlipPair([i, j])}
                  className={`py-1.5 rounded-lg text-xs font-black font-mono transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    doubleFlipPair[0] === i && doubleFlipPair[1] === j
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-rose-100/60"
                  }`}
                >
                  {bitName(i)} &amp; {bitName(j)}
                </button>
              ))}
            </div>
          </div>

          {/* Key-Value Metrics Grid */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 anim-card-sm">
              <span className="text-slate-600 font-semibold">Injected Pair:</span>
              <span className="font-mono font-bold text-rose-700">
                Bit {doubleFlipPair[0]} ({bitName(doubleFlipPair[0])}) &amp; Bit {doubleFlipPair[1]} ({bitName(doubleFlipPair[1])})
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 anim-card-sm">
              <span className="text-slate-600 font-semibold">Calculated Syndrome:</span>
              <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                [{s1_double}, {s2_double}, {s3_double}] → Dec {synDec_double} (Aliased!)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 anim-card-sm">
              <span className="text-slate-600 font-semibold">Ordinary Decoder Decision:</span>
              <span className="font-bold text-rose-800">
                Falsely inverts innocent Bit {synDec_double}!
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 anim-card-sm">
              <span className="text-slate-600 font-semibold">Final Codeword Errors:</span>
              <span className="font-bold text-rose-700">
                3 Corrupted Bits ({doubleFlipPair[0]}, {doubleFlipPair[1]}, and {synDec_double})!
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 anim-card-sm">
              <span className="text-slate-600 font-semibold">Extended SECDED Parity:</span>
              <span className="font-mono font-bold text-amber-800">
                P = {overallParityDouble} (Even / Double Error Alert!)
              </span>
            </div>
          </div>

          {/* Bottom Verdict Banner */}
          <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-300 text-xs text-rose-950 flex items-start gap-3 shadow-2xs anim-card-sm">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black block text-rose-900">Silent Data Corruption (SDC)</span>
              <span className="text-rose-800 text-[11px] leading-relaxed">
                Parity cancellation fooled the decoder into altering innocent Bit {synDec_double}. The receiver has ZERO awareness of corruption.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Double Error Fails: The Cancellation and Vector Aliasing Proof */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Why Ordinary Hamming(7,4) Cannot Safely Correct 2 Errors (Algebraic Proof)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The mathematical inevitability of parity cancellation and group closure
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Reason 1: Parity Cancellation in Shared Circles */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:bg-white hover:border-blue-400 space-y-2 anim-card cursor-pointer shadow-xs">
            <h4 className="font-bold text-slate-800 text-sm">1. Parity Cancellation in Shared Circles</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              When two bits flip that both belong to the same parity check (e.g. Bit 3 and Bit 5 both belong to circle p1),
              their two 1s cancel each other under modulo-2 arithmetic:
            </p>
            <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono text-xs text-blue-700 font-bold shadow-2xs">
              1 ⊕ 1 = 0 &nbsp;&rarr;&nbsp; Parity check p1 evaluates to PASS (s1 = 0)!
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Because circle 1 falsely passes, only circles 2 and 3 fail. The intersection of circle 2 and 3 isolates <b>Bit 6</b>,
              tricking the decoder into believing Bit 6 was corrupted!
            </p>
          </div>

          {/* Reason 2: Vector Aliasing in F_2^3 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:bg-white hover:border-rose-400 space-y-2 anim-card cursor-pointer shadow-xs">
            <h4 className="font-bold text-slate-800 text-sm">2. Vector Aliasing Closure in F_2^3</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              By linearity of the parity-check matrix H, the syndrome of error vector e = e_i ⊕ e_j is:
            </p>
            <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono text-xs text-rose-700 font-bold shadow-2xs">
              S = H · (e_i ⊕ e_j)^T = col_i(H) ⊕ col_j(H) = col_k(H)
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Since H contains <b>all 7 non-zero vectors</b> in F_2^3, the XOR sum of ANY two columns must match
              another column in H. In <b>100% of all 21 possible double-error pairs</b>, the syndrome aliases into an innocent 3rd bit!
            </p>
          </div>
        </div>

        {/* Live Vector Modulo-2 Equation for Current Pair */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 flex flex-wrap items-center justify-between gap-4 anim-card-sm shadow-2xs">
          <div className="text-xs text-rose-950 font-mono">
            <b>Current Selected Pair:</b> col_{doubleFlipPair[0]} [{colI.join(",")}] ⊕ col_{doubleFlipPair[1]} [{colJ.join(",")}] ={" "}
            <b>col_{aliasedK} [{sumCol.join(",")}]</b> (Decimal {aliasedK})
          </div>
          <span className="text-xs font-black text-rose-700 bg-white px-3 py-1 rounded-full border border-rose-300 shadow-2xs">
            Aliases into Innocent Bit {aliasedK}
          </span>
        </div>
      </div>
    </div>
  );
}