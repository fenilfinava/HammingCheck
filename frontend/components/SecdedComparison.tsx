"use client";

import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function SecdedComparison() {
  const [testScenario, setTestScenario] = useState<"clean" | "single" | "double">("double");

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>The Engineering Solution: Extended Hamming(8,4) SECDED</span>
        </h2>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          How modern server DDR4/DDR5 ECC RAM and aerospace computers prevent the double-error aliasing catastrophe.
        </p>

        {/* Scenario Toggle */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setTestScenario("clean")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              testScenario === "clean"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            Scenario 1: Clean Channel (0 Errors)
          </button>
          <button
            onClick={() => setTestScenario("single")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              testScenario === "single"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            Scenario 2: Single Error (1 Flip)
          </button>
          <button
            onClick={() => setTestScenario("double")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              testScenario === "double"
                ? "bg-red-600 text-white border-red-600"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            Scenario 3: Double Error (2 Flips) [Aliasing Test]
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ordinary Hamming(7,4) */}
        <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-red-900 text-base">
                Ordinary Hamming(7,4)
              </h3>
              <span className="text-xs px-2.5 py-1 rounded bg-red-50 border border-red-200 text-red-700 font-mono font-bold">
                d_min = 3
              </span>
            </div>

            <ul className="text-xs text-slate-700 space-y-2 mb-4 leading-relaxed">
              <li>• Parity bits: 3 bits (p1, p2, p4) protecting 4 data bits.</li>
              <li>• Capability: Single Error Correction (SEC) only.</li>
              <li>• Fatal flaw: Assumes EVERY non-zero syndrome is a 1-bit error.</li>
            </ul>

            {testScenario === "clean" && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-emerald-800">
                ✔ Syndrome S = 0. Codeword accepted as clean.
              </div>
            )}

            {testScenario === "single" && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                ✔ Syndrome S ≠ 0. Bit at position S is flipped and corrected.
              </div>
            )}

            {testScenario === "double" && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-2">
                <div className="font-bold text-red-950">❌ CATASTROPHIC DECODER ALIASING:</div>
                <div>Syndrome S ≠ 0 points to an UNCORRUPTED 3rd bit!</div>
                <div>Decoder flips the 3rd bit. Codeword now has <b>3 corrupted bits</b>!</div>
                <div className="text-red-700 font-bold">Silent Data Corruption without any warning!</div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            Outcome: {testScenario === "double" ? "RUINED DATA (100% Failure Rate)" : "Normal Operation"}
          </div>
        </div>

        {/* Extended SECDED(8,4) */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-emerald-900 text-base">
                Extended SECDED Hamming(8,4)
              </h3>
              <span className="text-xs px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold">
                d_min = 4
              </span>
            </div>

            <ul className="text-xs text-slate-700 space-y-2 mb-4 leading-relaxed">
              <li>• Appends 8th overall parity bit: p0 = sum of all 7 bits (mod 2).</li>
              <li>• Capability: Single Error Correction, Double Error Detection (SECDED).</li>
              <li>• Safeguard: Distinguishes odd-weight from even-weight errors.</li>
            </ul>

            {testScenario === "clean" && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-emerald-800">
                ✔ Syndrome S = 0, Overall Parity P = 0. Codeword verified pristine.
              </div>
            )}

            {testScenario === "single" && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                ✔ S ≠ 0 and P = 1 (Odd parity). Valid single error at bit S corrected safely!
              </div>
            )}

            {testScenario === "double" && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 space-y-2">
                <div className="font-bold text-emerald-900">🛡️ DOUBLE ERROR INTERCEPTED SAFELY:</div>
                <div>Syndrome S ≠ 0, but Overall Parity P = 0 (Even parity!).</div>
                <div>SECDED identifies that S is an ALIASED syndrome.</div>
                <div className="font-bold text-emerald-700">
                  Refuses to corrupt a 3rd bit! Raises an Uncorrectable Error (UE) interrupt!
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            Outcome: {testScenario === "double" ? "DOUBLE ERROR DETECTED (Safe Fallback)" : "Normal Operation"}
          </div>
        </div>
      </div>

      {/* Decision Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm mb-4">
          SECDED Dual-Check Decision Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono">
                <th className="py-2.5 px-3">Syndrome S</th>
                <th className="py-2.5 px-3">Overall Parity P</th>
                <th className="py-2.5 px-3">Diagnostic Condition</th>
                <th className="py-2.5 px-3">Action Taken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">S = 0</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">P = 0</td>
                <td className="py-2.5 px-3 text-slate-700 font-sans">No error occurred</td>
                <td className="py-2.5 px-3 text-emerald-700 font-sans">Accept codeword pristine</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-blue-700 font-bold">S ≠ 0</td>
                <td className="py-2.5 px-3 text-amber-700 font-bold">P = 1</td>
                <td className="py-2.5 px-3 text-slate-700 font-sans">Single error (Bits 1..7)</td>
                <td className="py-2.5 px-3 text-blue-700 font-sans">Correct bit S (Safe)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-600 font-bold">S = 0</td>
                <td className="py-2.5 px-3 text-amber-700 font-bold">P = 1</td>
                <td className="py-2.5 px-3 text-slate-700 font-sans">Parity bit p0 corrupted</td>
                <td className="py-2.5 px-3 text-slate-700 font-sans">Data bits pristine; flip p0</td>
              </tr>
              <tr className="bg-red-50 font-bold">
                <td className="py-2.5 px-3 text-red-700 font-bold">S ≠ 0</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">P = 0</td>
                <td className="py-2.5 px-3 text-red-900 font-sans">DOUBLE ERROR DETECTED!</td>
                <td className="py-2.5 px-3 text-red-700 font-sans">HALT false correction; raise alarm!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
