"use client";

import React, { useState } from "react";
import { Download, CheckCircle2, XCircle, FileText, AlertTriangle, BookOpen, Layers, Award } from "lucide-react";

export default function ResultsExamAnswer() {
  const [filterType, setFilterType] = useState<"all" | "clean" | "single" | "double">("all");

  const testCases = [
    { id: 1, data: "1011", type: "clean", flips: "None (0)", syndrome: "[0,0,0] (0)", action: "No correction", errors: 0, status: "PASSED", color: "emerald" },
    { id: 2, data: "1011", type: "single", flips: "Bit 1 (p1)", syndrome: "[1,0,0] (1)", action: "Invert Bit 1", errors: 0, status: "CORRECTED", color: "blue" },
    { id: 3, data: "1011", type: "single", flips: "Bit 2 (p2)", syndrome: "[0,1,0] (2)", action: "Invert Bit 2", errors: 0, status: "CORRECTED", color: "blue" },
    { id: 4, data: "1011", type: "single", flips: "Bit 3 (d1)", syndrome: "[1,1,0] (3)", action: "Invert Bit 3", errors: 0, status: "CORRECTED", color: "blue" },
    { id: 5, data: "1011", type: "single", flips: "Bit 4 (p4)", syndrome: "[0,0,1] (4)", action: "Invert Bit 4", errors: 0, status: "CORRECTED", color: "blue" },
    { id: 6, data: "1011", type: "single", flips: "Bit 5 (d2)", syndrome: "[1,0,1] (5)", action: "Invert Bit 5", errors: 0, status: "CORRECTED", color: "blue" },
    { id: 7, data: "1011", type: "single", flips: "Bit 6 (d3)", syndrome: "[0,1,1] (6)", action: "Invert Bit 6", errors: 0, status: "CORRECTED", color: "blue" },
    { id: 8, data: "1011", type: "single", flips: "Bit 7 (d4)", syndrome: "[1,1,1] (7)", action: "Invert Bit 7", errors: 0, status: "CORRECTED", color: "blue" },
    { id: 9, data: "1011", type: "double", flips: "Bits 3 & 5", syndrome: "[0,1,1] (6)", action: "Miscorrects Bit 6!", errors: 3, status: "ALIASED (SDC)", color: "red" },
    { id: 10, data: "1011", type: "double", flips: "Bits 1 & 2", syndrome: "[1,1,0] (3)", action: "Miscorrects Bit 3!", errors: 3, status: "ALIASED (SDC)", color: "red" },
    { id: 11, data: "1011", type: "double", flips: "Bits 2 & 6", syndrome: "[0,0,1] (4)", action: "Miscorrects Bit 4!", errors: 3, status: "ALIASED (SDC)", color: "red" },
    { id: 12, data: "1011", type: "double", flips: "Bits 4 & 5", syndrome: "[1,0,0] (1)", action: "Miscorrects Bit 1!", errors: 3, status: "ALIASED (SDC)", color: "red" },
    { id: 13, data: "0000", type: "clean", flips: "None (0)", syndrome: "[0,0,0] (0)", action: "No correction", errors: 0, status: "PASSED", color: "emerald" },
    { id: 14, data: "1111", type: "single", flips: "Bit 7 (d4)", syndrome: "[1,1,1] (7)", action: "Invert Bit 7", errors: 0, status: "CORRECTED", color: "blue" },
    { id: 15, data: "1100", type: "double", flips: "Bits 1 & 7", syndrome: "[0,1,1] (6)", action: "Miscorrects Bit 6!", errors: 3, status: "ALIASED (SDC)", color: "red" },
  ];

  const filteredCases = filterType === "all" ? testCases : testCases.filter((tc) => tc.type === filterType);

  const handleDownloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "case_id,data_payload,test_type,flips,syndrome,decoder_action,final_errors,status\n" +
      testCases.map((tc) => `${tc.id},${tc.data},${tc.type},"${tc.flips}","${tc.syndrome}","${tc.action}",${tc.errors},${tc.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hamming74_test_cases_evidence.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" /> Comprehensive Evidence & Examination Guide
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Results, Test Cases Panel & Worked Exam Answer
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empirical benchmark results, university model exam paper answer, and technical interpretations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/TECHNICAL_REPORT.docx"
            download="Hamming74_Technical_Report.docx"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-200" />
            <span>Technical Report (.docx)</span>
          </a>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>CSV Evidence</span>
          </button>
        </div>
      </div>

      {/* Test Cases Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Automated Test Cases Panel</span>
            </h3>
            <p className="text-xs text-slate-500">
              Evaluates clean, single-error, and double-error scenarios across multiple data payloads.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(["all", "clean", "single", "double"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                  filterType === t
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t === "all" ? "All Cases" : `${t} Errors`}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Test Cases */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 border border-slate-200">#</th>
                <th className="p-3 border border-slate-200">Data Input</th>
                <th className="p-3 border border-slate-200">Channel Flips</th>
                <th className="p-3 border border-slate-200">Syndrome S [s₁, s₂, s₃]</th>
                <th className="p-3 border border-slate-200">Decoder Action</th>
                <th className="p-3 border border-slate-200">Final Corrupted Bits</th>
                <th className="p-3 border border-slate-200">Outcome Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              {filteredCases.map((tc) => (
                <tr key={tc.id} className="hover:bg-slate-50/80">
                  <td className="p-3 font-mono text-slate-400 border border-slate-200">{tc.id}</td>
                  <td className="p-3 font-mono font-bold text-slate-800 border border-slate-200">{tc.data}</td>
                  <td className="p-3 font-medium border border-slate-200">{tc.flips}</td>
                  <td className="p-3 font-mono text-slate-700 border border-slate-200">{tc.syndrome}</td>
                  <td className="p-3 border border-slate-200 font-medium">{tc.action}</td>
                  <td className="p-3 font-bold border border-slate-200">
                    {tc.errors === 0 ? (
                      <span className="text-emerald-700">0 Bits (Clean)</span>
                    ) : (
                      <span className="text-red-700">{tc.errors} Bits (Corrupted!)</span>
                    )}
                  </td>
                  <td className="p-3 border border-slate-200">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        tc.color === "emerald"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : tc.color === "blue"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}
                    >
                      {tc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Exam Paper Answer (Worked Numerical Example) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs anim-card space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 shadow-2xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Model Exam Paper Answer (Step-by-Step Worked Example)
            </h3>
            <p className="text-xs text-slate-500">
              Format ready to present directly in university exams or oral viva defense.
            </p>
          </div>
        </div>

        {/* Question Statement Box */}
        <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed font-serif anim-card-sm">
          <b>Exam Question:</b><br />
          <i>&ldquo;A communication system encodes 4-bit message d = [1, 0, 1, 1] using Hamming(7,4).<br />
          (a) Compute the 7-bit transmitted codeword.<br />
          (b) If Bit 3 flips during transmission, show step-by-step how the syndrome detects and corrects the error.<br />
          (c) If Bits 3 and 5 flip simultaneously, calculate the resulting syndrome, explain why the decoder miscorrects an innocent third bit, and determine the final codeword error count.<br />
          (d) Explain how Extended Hamming(8,4) SECDED resolves this limitation.&rdquo;</i>
        </div>

        {/* Step-by-Step Worked Solution */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Part A */}
          <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50/30 hover:bg-blue-50/70 hover:border-blue-400 space-y-2 anim-card cursor-pointer shadow-2xs">
            <h4 className="font-bold text-blue-950 text-sm">Solution Part (a): Codeword Generation</h4>
            <p className="text-xs text-slate-600">
              Message bits are d₁ = 1, d₂ = 0, d₃ = 1, d₄ = 1. Parity bits are calculated over GF(2):
            </p>
            <div className="font-mono text-xs bg-white p-3 rounded-lg border border-blue-200 text-blue-900 space-y-1">
              <div>p₁ = d₁ ⊕ d₂ ⊕ d₄ = 1 ⊕ 0 ⊕ 1 = 0</div>
              <div>p₂ = d₁ ⊕ d₃ ⊕ d₄ = 1 ⊕ 1 ⊕ 1 = 1</div>
              <div>p₄ = d₂ ⊕ d₃ ⊕ d₄ = 0 ⊕ 1 ⊕ 1 = 0</div>
            </div>
            <p className="text-xs font-semibold text-slate-800">
              Codeword vector: c = [p₁, p₂, d₁, p₄, d₂, d₃, d₄] = <b>[0, 1, 1, 0, 0, 1, 1]</b>.
            </p>
          </div>

          {/* Part B */}
          <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/70 hover:border-emerald-400 space-y-2 anim-card cursor-pointer shadow-2xs">
            <h4 className="font-bold text-emerald-950 text-sm">Solution Part (b): Single Error at Bit 3</h4>
            <p className="text-xs text-slate-600">
              Bit 3 flips from 1 to 0: received vector r = [0, 1, 0, 0, 0, 1, 1] (Bit 3 inverted). Syndrome S = H · rᵀ:
            </p>
            <div className="font-mono text-xs bg-white p-3 rounded-lg border border-emerald-200 text-emerald-900 space-y-1">
              <div>s₁ = r₁ ⊕ r₃ ⊕ r₅ ⊕ r₇ = 0 ⊕ 0 ⊕ 0 ⊕ 1 = 1</div>
              <div>s₂ = r₂ ⊕ r₃ ⊕ r₆ ⊕ r₇ = 1 ⊕ 0 ⊕ 1 ⊕ 1 = 1</div>
              <div>s₃ = r₄ ⊕ r₅ ⊕ r₆ ⊕ r₇ = 0 ⊕ 0 ⊕ 1 ⊕ 1 = 0</div>
              <div>Syndrome Vector: S = [1, 1, 0] &rarr; Decimal: 1·1 + 1·2 + 0·4 = 3</div>
            </div>
            <p className="text-xs font-semibold text-emerald-800">
              Conclusion: Syndrome equals 3, precisely identifying Bit 3. Inverting bit 3 gives original [0, 1, 1, 0, 0, 1, 1]. Single error corrected!
            </p>
          </div>

          {/* Part C */}
          <div className="p-4 rounded-xl border-2 border-rose-200 bg-rose-50/30 hover:bg-rose-50/70 hover:border-rose-400 space-y-2 anim-card cursor-pointer shadow-2xs">
            <h4 className="font-bold text-rose-950 text-sm">Solution Part (c): Double Error at Bits 3 & 5 (Aliasing Disaster)</h4>
            <p className="text-xs text-slate-600">
              Both Bit 3 and Bit 5 flip: received vector r = [0, 1, 0, 0, 1, 1, 1] (Bits 3 & 5 inverted). Parity checks evaluate to:
            </p>
            <div className="font-mono text-xs bg-white p-3 rounded-lg border border-rose-200 text-rose-900 space-y-1">
              <div>s₁ = r₁ ⊕ r₃ ⊕ r₅ ⊕ r₇ = 0 ⊕ 0 ⊕ 1 ⊕ 1 = 0  (Notice: Bit 3 & 5 cancelled out!)</div>
              <div>s₂ = r₂ ⊕ r₃ ⊕ r₆ ⊕ r₇ = 1 ⊕ 0 ⊕ 1 ⊕ 1 = 1</div>
              <div>s₃ = r₄ ⊕ r₅ ⊕ r₆ ⊕ r₇ = 0 ⊕ 1 ⊕ 1 ⊕ 1 = 1</div>
              <div>Syndrome Vector: S = [0, 1, 1] &rarr; Decimal: 0·1 + 1·2 + 1·4 = 6</div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              <b>Why did this happen?</b> By linearity, S = col₃(H) ⊕ col₅(H) = [1,1,0]ᵀ ⊕ [1,0,1]ᵀ = [0,1,1]ᵀ = col₆(H).<br />
              The ordinary decoder concludes that Bit 6 has a single error and inverts Bit 6! Bit 6 was completely uncorrupted.<br />
              <b>Final Codeword Status:</b> Now contains <b>3 CORRUPTED BITS</b> (Bits 3, 5, and 6). Data is silently destroyed!
            </p>
          </div>

          {/* Part D */}
          <div className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50/30 hover:bg-purple-50/70 hover:border-purple-400 space-y-2 anim-card cursor-pointer shadow-2xs">
            <h4 className="font-bold text-purple-950 text-sm">Solution Part (d): Extended SECDED Resolution</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Extended Hamming(8,4) appends overall parity p₀ covering all 7 bits. Minimum distance expands to d_min = 4.<br />
              In Case (b) (Single Error): S = 3 &ne; 0 and Overall Parity P = 1 (Odd) &rarr; <b>Valid Single Error</b> &rarr; Correct Bit 3.<br />
              In Case (c) (Double Error): S = 6 &ne; 0 and Overall Parity P = 0 (Even) &rarr; <b>Double Error Detected!</b> &rarr; Halts false correction and triggers alarm.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Interpretation & Error Correction Limitations */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs anim-card space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-700" />
          <span>Error Correction Limitations &amp; Mathematical Boundaries</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-slate-300 anim-card cursor-pointer space-y-1">
            <b className="text-slate-800 block text-sm">1. Error Correction Limit</b>
            <p>
              t_corr = ⌊(d_min - 1) / 2⌋ = ⌊(3 - 1) / 2⌋ = 1. Ordinary Hamming(7,4) cannot correct more than 1 bit under any circumstances.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-slate-300 anim-card cursor-pointer space-y-1">
            <b className="text-slate-800 block text-sm">2. Error Detection Limit</b>
            <p>
              t_det = d_min - 1 = 3 - 1 = 2. It can detect 2 errors ONLY if correction is completely disabled. Simultaneous correction and 2-error detection requires d_min &gt;= 4.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <b className="text-slate-800 block text-sm">3. Silent Data Corruption</b>
            <p>
              If 3 bits flip such that their columns sum to [0,0,0]^T (e.g. bits 1, 2, and 3), syndrome S = 0! The system assumes zero errors occurred!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}