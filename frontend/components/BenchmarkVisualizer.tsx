"use client";

import React from "react";
import { Download, BarChart } from "lucide-react";

export default function BenchmarkVisualizer() {
  const handleDownloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "data,num_errors,flips,syndrome_dec,data_restored,codeword_restored,final_errors,outcome\n" +
      "1011,0,none,0,True,True,0,CORRECT_NO_ERROR\n" +
      "1011,1,3,3,True,True,0,SINGLE_ERROR_SUCCESSFULLY_CORRECTED\n" +
      "1011,2,3+5,6,False,False,3,DOUBLE_ERROR_MISCORRECTION_ALIASING\n" +
      "# Full 464 test vectors available in evidence/test_results.csv or backend /api/export-csv";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hamming74_benchmark_evidence.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            🧪 Exhaustive Test Suite & Captured Evidence
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Empirical Benchmark: 464 Distinct Channel Scenarios
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            All 16 4-bit payloads × (1 clean + 7 single-error permutations + 21 double-error combinations)
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition shadow-sm"
        >
          <Download className="w-4 h-4 text-emerald-400" /> Download CSV Evidence
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block mb-1">Pristine Channel (0 Errors)</span>
          <div className="text-3xl font-mono font-extrabold text-emerald-600">100.0%</div>
          <span className="text-xs text-slate-500 mt-1 block">16 / 16 test vectors verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block mb-1">Single Error Correction (SEC)</span>
          <div className="text-3xl font-mono font-extrabold text-blue-600">100.0%</div>
          <span className="text-xs text-slate-500 mt-1 block">112 / 112 single flips corrected</span>
        </div>

        <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200 shadow-sm">
          <span className="text-xs text-red-700 font-semibold block mb-1">Double Error Safe Correction</span>
          <div className="text-3xl font-mono font-extrabold text-red-600">0.0%</div>
          <span className="text-xs text-red-600 mt-1 block">0 / 336 (100% Aliased to 3 errors!)</span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-sm">
          <span className="text-xs text-emerald-700 font-semibold block mb-1">SECDED Double Error Detection</span>
          <div className="text-3xl font-mono font-extrabold text-emerald-600">100.0%</div>
          <span className="text-xs text-emerald-700 mt-1 block">336 / 336 halted false correction</span>
        </div>
      </div>

      {/* Visual Bar Comparison Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-6 flex items-center gap-2">
          <BarChart className="w-4 h-4 text-blue-600" />
          <span>Performance Comparison: Ordinary Hamming(7,4) vs Extended SECDED(8,4)</span>
        </h3>

        <div className="space-y-6">
          {/* Bar 1 */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-700">Single-Error Correction Success Rate (N=112):</span>
              <span className="text-emerald-700 font-mono font-bold">100.0% (112/112)</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          {/* Bar 2 */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-700">Ordinary Hamming(7,4) Double-Error Safe Correction Rate (N=336):</span>
              <span className="text-red-700 font-mono font-bold">0.0% (0/336) [100% Miscorrected!]</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div className="h-full bg-red-600 rounded-full" style={{ width: "0%" }} />
            </div>
          </div>

          {/* Bar 3 */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-700">Ordinary Hamming(7,4) Aliasing / Silent Corruption Rate (N=336):</span>
              <span className="text-red-700 font-mono font-bold">100.0% (336/336 Catastrophic Flaw!)</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div className="h-full bg-red-600 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          {/* Bar 4 */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-700">Extended Hamming(8,4) SECDED Double-Error Detection Rate (N=336):</span>
              <span className="text-blue-700 font-mono font-bold">100.0% (336/336 Alarm Raised Safely)</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
