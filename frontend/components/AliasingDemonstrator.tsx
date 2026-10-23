"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function AliasingDemonstrator() {
  const [selectedPair, setSelectedPair] = useState<[number, number]>([3, 5]);

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

  const bitRoles: Record<number, string> = {
    1: "p1",
    2: "p2",
    3: "d1",
    4: "p4",
    5: "d2",
    6: "d3",
    7: "d4",
  };

  // Compute all 21 pairs
  const allPairs: {
    index: number;
    i: number;
    j: number;
    colI: number[];
    colJ: number[];
    sumCol: number[];
    aliasK: number;
  }[] = [];

  let idx = 1;
  for (let i = 1; i <= 6; i++) {
    for (let j = i + 1; j <= 7; j++) {
      const colI = H_cols[i];
      const colJ = H_cols[j];
      const sumCol = [colI[0] ^ colJ[0], colI[1] ^ colJ[1], colI[2] ^ colJ[2]];
      const aliasK = sumCol[0] * 1 + sumCol[1] * 2 + sumCol[2] * 4;

      allPairs.push({
        index: idx++,
        i,
        j,
        colI,
        colJ,
        sumCol,
        aliasK,
      });
    }
  }

  // Selected pair computation
  const activeColI = H_cols[selectedPair[0]];
  const activeColJ = H_cols[selectedPair[1]];
  const activeSum = [
    activeColI[0] ^ activeColJ[0],
    activeColI[1] ^ activeColJ[1],
    activeColI[2] ^ activeColJ[2],
  ];
  const activeAliasK = activeSum[0] * 1 + activeSum[1] * 2 + activeSum[2] * 4;

  return (
    <div className="space-y-6">
      {/* Mathematical Principle Header */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 rounded-xl text-red-700">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-950">
              The Fundamental Flaw: Universal Decoder Aliasing in Hamming(7,4)
            </h2>
            <p className="text-sm text-red-900 mt-1 leading-relaxed">
              Because the parity-check matrix H contains <b>ALL 7 non-zero 3-bit binary vectors</b>, the XOR sum of ANY two distinct columns is GUARANTEED by group closure in F_2^3 to produce another non-zero vector that matches a third column:
            </p>
            <div className="mt-3 p-3 bg-white border border-red-300 rounded-xl font-mono text-sm text-red-700 font-bold inline-block shadow-sm">
              col_i(H) ⊕ col_j(H) ≡ col_k(H) &nbsp;&nbsp;(where k ≠ i and k ≠ j)
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Vector Addition Sandbox */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Interactive Double-Error Pair Vector Calculator</span>
          <span className="text-xs text-blue-700 font-semibold">Select any 2 bits to observe modulo-2 column addition</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Column i */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <label className="text-xs text-slate-600 block mb-2 font-bold uppercase tracking-wider">
              Select 1st Error (Bit i):
            </label>
            <select
              value={selectedPair[0]}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val !== selectedPair[1]) setSelectedPair([val, selectedPair[1]]);
              }}
              className="bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-sm font-mono w-full shadow-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((b) => (
                <option key={b} value={b} disabled={b === selectedPair[1]}>
                  Bit {b} ({bitRoles[b]})
                </option>
              ))}
            </select>
            <div className="mt-3 font-mono text-lg font-bold text-blue-700">
              col_{selectedPair[0]} = [{activeColI.join(", ")}]ᵀ
            </div>
          </div>

          {/* Column j */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <label className="text-xs text-slate-600 block mb-2 font-bold uppercase tracking-wider">
              Select 2nd Error (Bit j):
            </label>
            <select
              value={selectedPair[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val !== selectedPair[0]) setSelectedPair([selectedPair[0], val]);
              }}
              className="bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-sm font-mono w-full shadow-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((b) => (
                <option key={b} value={b} disabled={b === selectedPair[0]}>
                  Bit {b} ({bitRoles[b]})
                </option>
              ))}
            </select>
            <div className="mt-3 font-mono text-lg font-bold text-emerald-700">
              col_{selectedPair[1]} = [{activeColJ.join(", ")}]ᵀ
            </div>
          </div>

          {/* Resulting Aliased Column */}
          <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-center">
            <span className="text-xs text-red-800 block mb-1 font-bold uppercase tracking-wider">
              Sum Column (Mod 2) = col_k:
            </span>
            <div className="font-mono text-lg font-bold text-red-700">
              [{activeSum.join(", ")}]ᵀ
            </div>
            <div className="mt-2 text-sm font-bold text-red-900 bg-white py-1 px-3 rounded-full inline-block border border-red-300 shadow-sm">
              Matches Bit {activeAliasK} ({bitRoles[activeAliasK]})!
            </div>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <b className="text-red-700 font-bold">The 3-Bit Corruption Trap:</b> Channel introduced 2 errors at <b>Bits [{selectedPair.join(", ")}]</b>.
          The ordinary Hamming(7,4) decoder receives syndrome <b>{activeAliasK}</b> and assumes a single error occurred at <b>Bit {activeAliasK}</b>.
          The decoder inverts Bit {activeAliasK}. Now bits <b>{selectedPair[0]}, {selectedPair[1]}, and {activeAliasK}</b> are ALL corrupted (3 bits total)!
        </div>
      </div>

      {/* Exhaustive 21-Pairs Truth Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-sm">
            Exhaustive Table of All C(7, 2) = 21 Double-Error Combinations
          </h3>
          <span className="text-xs px-2.5 py-1 rounded bg-red-50 text-red-700 border border-red-200 font-mono font-bold">
            Aliasing Rate: 21 / 21 (100.0%)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Injected Flips</th>
                <th className="py-2.5 px-3">col_i(H) ⊕ col_j(H)</th>
                <th className="py-2.5 px-3">Sum Vector</th>
                <th className="py-2.5 px-3">Aliased Syndrome</th>
                <th className="py-2.5 px-3">Decoder Action</th>
                <th className="py-2.5 px-3">Resulting State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {allPairs.map((p) => {
                const isSelected =
                  (p.i === selectedPair[0] && p.j === selectedPair[1]) ||
                  (p.i === selectedPair[1] && p.j === selectedPair[0]);

                return (
                  <tr
                    key={p.index}
                    onClick={() => setSelectedPair([p.i, p.j])}
                    className={`cursor-pointer transition ${
                      isSelected
                        ? "bg-red-50 font-bold text-red-900"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <td className="py-2 px-3 text-slate-400">{p.index}</td>
                    <td className="py-2 px-3 text-blue-700 font-bold">
                      Bits [{p.i}, {p.j}] ({bitRoles[p.i]},{bitRoles[p.j]})
                    </td>
                    <td className="py-2 px-3 text-slate-500">
                      [{p.colI.join("")}] ⊕ [{p.colJ.join("")}]
                    </td>
                    <td className="py-2 px-3 text-emerald-700 font-bold">
                      [{p.sumCol.join("")}]
                    </td>
                    <td className="py-2 px-3 text-red-700 font-bold">
                      Bit {p.aliasK} ({bitRoles[p.aliasK]})
                    </td>
                    <td className="py-2 px-3 text-amber-700">
                      Inverts Bit {p.aliasK}
                    </td>
                    <td className="py-2 px-3 text-red-600 font-sans font-medium">
                      Corrupts 3 bits: [{p.i}, {p.j}, {p.aliasK}]
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
