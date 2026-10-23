"use client";

import React from "react";
import { BookOpen } from "lucide-react";

export default function MathTheory() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>Mathematical Foundations & Algebraic Formalism</span>
        </h2>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          Hamming(7,4) is an exact linear block code defined over Galois Field F_2 with parameters (n, k) = (7, 4) and code rate R = 4/7 ≈ 0.5714.
        </p>
      </div>

      {/* Grid: G and H Matrices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generator Matrix */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800 text-sm">Generator Matrix G (4 x 7)</h3>
            <span className="text-xs font-mono text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">c = d · G (mod 2)</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Generates a 7-bit codeword c = [p1, p2, d1, p4, d2, d3, d4] from 4-bit message d = [d1, d2, d3, d4].
          </p>

          <div className="font-mono text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto text-slate-800 leading-relaxed">
            <div className="text-slate-400 font-semibold mb-1">{"   p1  p2  d1  p4  d2  d3  d4"}</div>
            <div>{"d1: [ 1,  1,  1,  0,  0,  0,  0 ]"}</div>
            <div>{"d2: [ 1,  0,  0,  1,  1,  0,  0 ]"}</div>
            <div>{"d3: [ 0,  1,  0,  1,  0,  1,  0 ]"}</div>
            <div>{"d4: [ 1,  1,  0,  1,  0,  0,  1 ]"}</div>
          </div>
        </div>

        {/* Parity Check Matrix */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800 text-sm">Parity-Check Matrix H (3 x 7)</h3>
            <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">S = H · r^T (mod 2)</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Columns are precisely the 3-bit binary expansions of 1-based indices 1 to 7.
          </p>

          <div className="font-mono text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto text-slate-800 leading-relaxed">
            <div className="text-slate-400 font-semibold mb-1">{"   c1  c2  c3  c4  c5  c6  c7"}</div>
            <div>{"s1: [ 1,  0,  1,  0,  1,  0,  1 ]  (checks {1,3,5,7})"}</div>
            <div>{"s2: [ 0,  1,  1,  0,  0,  1,  1 ]  (checks {2,3,6,7})"}</div>
            <div>{"s3: [ 0,  0,  0,  1,  1,  1,  1 ]  (checks {4,5,6,7})"}</div>
          </div>
        </div>
      </div>

      {/* Minimum Distance and Sphere Packing Bound */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-3">
            Proof of Minimum Hamming Distance d_min = 3
          </h3>
          <ul className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
            <li>
              <b className="text-slate-800">1. Linear Independence:</b> A code has d_min &gt;= d iff every d-1 columns of H are linearly independent.
            </li>
            <li>
              <b className="text-slate-800">2. No Zero Columns:</b> Every column has weight &gt;= 1 implies d_min &gt; 1.
            </li>
            <li>
              <b className="text-slate-800">3. Pairwise Distinct:</b> No two columns are equal implies no 2 columns add to zero implies d_min &gt; 2.
            </li>
            <li>
              <b className="text-slate-800">4. Triplet Dependence:</b> Columns 1, 2, and 3 sum to [0,0,0]^T:
              <span className="font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 block mt-1">
                col_1 [1,0,0] + col_2 [0,1,0] + col_3 [1,1,0] = [0,0,0]^T (mod 2)
              </span>
            </li>
            <li className="text-emerald-700 font-bold pt-1">
              Therefore, d_min is strictly 3. Error correction capability t = ⌊(3-1)/2⌋ = 1.
            </li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-3">
            The Perfect Code Property (Hamming Sphere Bound)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            The sphere packing bound for code length n=7, dimension k=4, and error capability t=1:
          </p>
          <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 font-mono text-xs text-amber-900 font-bold">
            2^k · [ C(n, 0) + C(n, 1) ] &lt;= 2^n<br />
            16 · [ 1 + 7 ] = 16 · 8 = 128 = 2^7
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Because strict equality holds (128 = 128), Hamming(7,4) is a <b className="text-slate-800">perfect code</b>. Every single vector in F_2^7 belongs to the radius-1 sphere of some valid codeword, leaving zero unassigned words in the entire 128-dimensional vector space.
          </p>
        </div>
      </div>
    </div>
  );
}
