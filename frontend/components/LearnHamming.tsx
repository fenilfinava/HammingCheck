"use client";

import React, { useState } from "react";
import { BookOpen, Layers, CheckCircle2, Binary, Table } from "lucide-react";

export default function LearnHamming() {
  const [dataBits, setDataBits] = useState<number[]>([1, 0, 1, 1]);

  // Modulo-2 parity computation
  const p1 = dataBits[0] ^ dataBits[1] ^ dataBits[3];
  const p2 = dataBits[0] ^ dataBits[2] ^ dataBits[3];
  const p4 = dataBits[1] ^ dataBits[2] ^ dataBits[3];

  const codeword = [p1, p2, dataBits[0], p4, dataBits[1], dataBits[2], dataBits[3]];

  const toggleBit = (idx: number) => {
    const updated = [...dataBits];
    updated[idx] ^= 1;
    setDataBits(updated);
  };

  const bitPositions = [
    { pos: 1, name: "p1", bin: "001", role: "Parity 1", desc: "Checks {1, 3, 5, 7}", isParity: true },
    { pos: 2, name: "p2", bin: "010", role: "Parity 2", desc: "Checks {2, 3, 6, 7}", isParity: true },
    { pos: 3, name: "d1", bin: "011", role: "Data 1", desc: "Original Bit 1", isParity: false },
    { pos: 4, name: "p4", bin: "100", role: "Parity 4", desc: "Checks {4, 5, 6, 7}", isParity: true },
    { pos: 5, name: "d2", bin: "101", role: "Data 2", desc: "Original Bit 2", isParity: false },
    { pos: 6, name: "d3", bin: "110", role: "Data 3", desc: "Original Bit 3", isParity: false },
    { pos: 7, name: "d4", bin: "111", role: "Data 4", desc: "Original Bit 4", isParity: false },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Hamming(7,4) Code Structure & Parity Mechanics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              4 Message Bits + 3 Parity Bits = 7-Bit Linear Block Codeword defined over Galois Field GF(2)
            </p>
          </div>
        </div>
      </div>

      {/* Bit Position Table (1-indexed power-of-2 layout) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs anim-card space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Table className="w-4 h-4 text-blue-600" />
          <span>1-Indexed Bit Positions (Why Powers of 2?)</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Hamming placed parity check bits strictly at bit indices that are <b className="text-slate-900">powers of 2 (2⁰=1, 2¹=2, 2²=4)</b>.
          All remaining positions (3, 5, 6, 7) are reserved for data payload bits. Why? Because in binary arithmetic,
          every integer 1 ≤ k ≤ 7 has a unique 3-bit binary expansion:
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-xs text-center border-collapse overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-2.5 border-b border-r border-slate-200">Bit Index (Decimal)</th>
                {bitPositions.map((b) => (
                  <th key={b.pos} className={`p-2.5 border-b border-r border-slate-200 ${b.isParity ? "bg-blue-50 text-blue-800" : ""}`}>
                    {b.pos}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-slate-700 divide-y divide-slate-200">
              <tr>
                <td className="p-2.5 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">Binary Expansion</td>
                {bitPositions.map((b) => (
                  <td key={b.pos} className="p-2.5 font-mono text-slate-600 border-r border-slate-200">
                    {b.bin}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">Bit Role / Symbol</td>
                {bitPositions.map((b) => (
                  <td
                    key={b.pos}
                    className={`p-2.5 font-bold border-r border-slate-200 ${
                      b.isParity ? "bg-blue-50/80 text-blue-700" : "bg-emerald-50/50 text-emerald-800"
                    }`}
                  >
                    {b.name}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">Check Set / Definition</td>
                {bitPositions.map((b) => (
                  <td key={b.pos} className="p-2.5 text-[11px] text-slate-500 border-r border-slate-200">
                    {b.desc}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Parity Calculation Mechanics (Even Parity) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs anim-card space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Binary className="w-4 h-4 text-emerald-600" />
          <span>Even Parity Equations: How Parity Bits are Calculated</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Hamming(7,4) uses <b>Even Parity</b> over Galois Field GF(2), where addition is bitwise XOR (⊕) and multiplication is AND.
          Each parity bit enforces an <b>even total number of 1s</b> across its designated check group:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50/40 hover:bg-blue-50/90 hover:border-blue-400 space-y-2.5 shadow-2xs anim-card cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 text-sm">Parity Bit p₁ (Index 1)</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">Binary Bit 0 = 1</span>
            </div>
            <p className="text-xs text-slate-600">
              Checks all indices whose binary coordinate has a 1 in position 0: <b>&#123;1, 3, 5, 7&#125;</b>.
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-blue-200 font-mono text-sm text-blue-800 font-bold shadow-xs">
              p₁ = d₁ ⊕ d₂ ⊕ d₄
            </div>
          </div>

          <div className="p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/90 hover:border-indigo-400 space-y-2.5 shadow-2xs anim-card cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900 text-sm">Parity Bit p₂ (Index 2)</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold">Binary Bit 1 = 1</span>
            </div>
            <p className="text-xs text-slate-600">
              Checks all indices whose binary coordinate has a 1 in position 1: <b>&#123;2, 3, 6, 7&#125;</b>.
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-indigo-200 font-mono text-sm text-indigo-800 font-bold shadow-xs">
              p₂ = d₁ ⊕ d₃ ⊕ d₄
            </div>
          </div>

          <div className="p-4 rounded-xl border-2 border-violet-200 bg-violet-50/40 hover:bg-violet-50/90 hover:border-violet-400 space-y-2.5 shadow-2xs anim-card cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-bold text-violet-900 text-sm">Parity Bit p₄ (Index 4)</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-violet-100 text-violet-800 font-semibold">Binary Bit 2 = 1</span>
            </div>
            <p className="text-xs text-slate-600">
              Checks all indices whose binary coordinate has a 1 in position 2: <b>&#123;4, 5, 6, 7&#125;</b>.
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-violet-200 font-mono text-sm text-violet-800 font-bold shadow-xs">
              p₄ = d₂ ⊕ d₃ ⊕ d₄
            </div>
          </div>
        </div>

        {/* Live Interactive Calculation Sandbox */}
        <div className="mt-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Live Encoder Demo (Try changing 4-bit data):</h4>
              <p className="text-xs text-slate-500">Click any data bit below to see parity bits recompute in real-time:</p>
            </div>
            <div className="flex gap-2">
              {[
                { label: "1011 (Dec 11)", val: [1, 0, 1, 1] },
                { label: "1100 (Dec 12)", val: [1, 1, 0, 0] },
                { label: "0101 (Dec 5)", val: [0, 1, 0, 1] },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setDataBits(preset.val)}
                  className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-blue-400 transition cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Data Bits Toggles */}
          <div className="flex flex-wrap gap-3">
            {dataBits.map((bit, idx) => (
              <button
                key={idx}
                onClick={() => toggleBit(idx)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 shadow-xs transition cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-500">d{idx + 1}:</span>
                <span className="font-mono text-base font-black text-blue-700">{bit}</span>
                <span className="text-[10px] font-semibold text-slate-400">(click)</span>
              </button>
            ))}
          </div>

          {/* Computed Output */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Computed Parity Bits:</span>
              <div className="font-mono text-xs text-slate-700 space-y-1 pt-1">
                <div>p₁ = {dataBits[0]} ⊕ {dataBits[1]} ⊕ {dataBits[3]} = <b className="text-blue-700 font-bold">{p1}</b></div>
                <div>p₂ = {dataBits[0]} ⊕ {dataBits[2]} ⊕ {dataBits[3]} = <b className="text-blue-700 font-bold">{p2}</b></div>
                <div>p₄ = {dataBits[1]} ⊕ {dataBits[2]} ⊕ {dataBits[3]} = <b className="text-blue-700 font-bold">{p4}</b></div>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Final Transmitted Codeword:</span>
              <div className="flex gap-1.5 pt-2 overflow-x-auto">
                {codeword.map((b, idx) => {
                  const isP = idx === 0 || idx === 1 || idx === 3;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center justify-center w-8 h-10 rounded-lg font-mono text-sm font-bold border ${
                        isP ? "bg-blue-50 border-blue-300 text-blue-800" : "bg-emerald-50 border-emerald-300 text-emerald-800"
                      }`}
                    >
                      <span className="text-[9px] font-normal text-slate-400">
                        {idx === 0 ? "p1" : idx === 1 ? "p2" : idx === 2 ? "d1" : idx === 3 ? "p4" : `d${idx - 2}`}
                      </span>
                      <span>{b}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Matrix G and Parity Check Matrix H */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs anim-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Generator Matrix G (4 × 7)</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              c = d · G (mod 2)
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Encodes any 4-bit message <span className="font-mono font-semibold text-slate-700">d = [d₁, d₂, d₃, d₄]</span> into a 7-bit codeword vector.
          </p>

          <div className="font-mono text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto text-slate-800 leading-relaxed shadow-inner">
            <div className="text-slate-400 font-semibold mb-1">{"   p1  p2  d1  p4  d2  d3  d4"}</div>
            <div>{"d1: [ 1,  1,  1,  0,  0,  0,  0 ]"}</div>
            <div>{"d2: [ 1,  0,  0,  1,  1,  0,  0 ]"}</div>
            <div>{"d3: [ 0,  1,  0,  1,  0,  1,  0 ]"}</div>
            <div>{"d4: [ 1,  1,  0,  1,  0,  0,  1 ]"}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs anim-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Parity-Check Matrix H (3 × 7)</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              S = H · rᵀ (mod 2)
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Column <span className="font-mono font-semibold text-slate-700">i</span> is precisely the 3-bit binary representation of index <span className="font-mono font-semibold text-slate-700">i (1 ≤ i ≤ 7)</span>.
          </p>

          <div className="font-mono text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto text-slate-800 leading-relaxed shadow-inner">
            <div className="text-slate-400 font-semibold mb-1">{"   c1  c2  c3  c4  c5  c6  c7"}</div>
            <div>{"s1: [ 1,  0,  1,  0,  1,  0,  1 ]  (checks {1,3,5,7})"}</div>
            <div>{"s2: [ 0,  1,  1,  0,  0,  1,  1 ]  (checks {2,3,6,7})"}</div>
            <div>{"s3: [ 0,  0,  0,  1,  1,  1,  1 ]  (checks {4,5,6,7})"}</div>
          </div>
        </div>
      </div>

      {/* Proof of d_min = 3 and Perfect Code Bound */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs anim-card space-y-3">
          <h3 className="font-bold text-slate-800 text-sm">
            Mathematical Proof: Minimum Distance d_min = 3
          </h3>
          <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <li>
              <b>1. Linear Independence:</b> A linear block code has minimum distance d_min ≥ d if and only if
              every d - 1 columns of H are linearly independent.
            </li>
            <li>
              <b>2. No Zero Column:</b> Every column in H has weight ≥ 1 implies d_min &gt; 1.
            </li>
            <li>
              <b>3. Pairwise Distinct:</b> No two columns of H are identical implies no 2 columns add to zero implies d_min &gt; 2.
            </li>
            <li>
              <b>4. Triplet Dependence:</b> Columns 1, 2, and 3 sum to [0,0,0]ᵀ:
              <div className="font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 mt-1">
                col₁ [1,0,0] ⊕ col₂ [0,1,0] ⊕ col₃ [1,1,0] = [0,0,0]ᵀ (mod 2)
              </div>
            </li>
            <li className="text-emerald-700 font-bold pt-1">
              Therefore, d_min is strictly 3. Error correction capability is t = ⌊(3-1)/2⌋ = 1.
            </li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs anim-card space-y-3">
          <h3 className="font-bold text-slate-800 text-sm">
            Hamming Sphere Packing Bound (Perfect Code)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Hamming bound for message length k = 4, codeword length n = 7, and error tolerance t = 1:
          </p>
          <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 font-mono text-xs text-amber-900 font-bold space-y-1">
            <div>2ᵏ · [ C(n, 0) + C(n, 1) ] ≤ 2ⁿ</div>
            <div>2⁴ · [ 1 + 7 ] = 16 · 8 = 128 = 2⁷</div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Because strict equality holds (128 = 128), Hamming(7,4) is a <b className="text-slate-800">Perfect Code</b>. Every single 7-bit binary vector
            in the entire 128-dimensional vector space belongs to the radius-1 sphere of exactly one valid codeword!
          </p>
        </div>
      </div>
    </div>
  );
}