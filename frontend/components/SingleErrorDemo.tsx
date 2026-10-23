"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft, Zap, RotateCcw, AlertCircle } from "lucide-react";

export default function SingleErrorDemo() {
  const [dataBits, setDataBits] = useState<number[]>([1, 0, 1, 1]);
  const [selectedFlipPos, setSelectedFlipPos] = useState<number>(3); // Default bit 3 (d1)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Compute 7-bit codeword
  const p1 = dataBits[0] ^ dataBits[1] ^ dataBits[3];
  const p2 = dataBits[0] ^ dataBits[2] ^ dataBits[3];
  const p4 = dataBits[1] ^ dataBits[2] ^ dataBits[3];
  const txCodeword = [p1, p2, dataBits[0], p4, dataBits[1], dataBits[2], dataBits[3]];

  // Received vector with 1 bit flipped
  const rxVector = [...txCodeword];
  if (selectedFlipPos >= 1 && selectedFlipPos <= 7) {
    rxVector[selectedFlipPos - 1] ^= 1;
  }

  // Parity equations on received vector
  const s1 = rxVector[0] ^ rxVector[2] ^ rxVector[4] ^ rxVector[6];
  const s2 = rxVector[1] ^ rxVector[2] ^ rxVector[5] ^ rxVector[6];
  const s3 = rxVector[3] ^ rxVector[4] ^ rxVector[5] ^ rxVector[6];
  const syndromeDec = s1 * 1 + s2 * 2 + s3 * 4;

  // Corrected vector
  const correctedVector = [...rxVector];
  if (syndromeDec >= 1 && syndromeDec <= 7) {
    correctedVector[syndromeDec - 1] ^= 1;
  }
  const decodedData = [correctedVector[2], correctedVector[4], correctedVector[5], correctedVector[6]];
  const isSuccessfullyRestored = decodedData.every((bit, idx) => bit === dataBits[idx]);

  const toggleDataBit = (idx: number) => {
    const updated = [...dataBits];
    updated[idx] ^= 1;
    setDataBits(updated);
  };

  const steps = [
    {
      num: 1,
      title: "Input 4 Data Bits",
      desc: "User selects 4-bit message d = [d1, d2, d3, d4].",
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            Selected 4-bit data payload: <b>[{dataBits.join(", ")}]</b> (Decimal {dataBits[0]*8 + dataBits[1]*4 + dataBits[2]*2 + dataBits[3]}).
          </p>
          <div className="flex gap-2">
            {dataBits.map((b, i) => (
              <button
                key={i}
                onClick={() => toggleDataBit(i)}
                className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 hover:border-blue-500 font-mono text-sm font-bold text-blue-800 transition shadow-sm"
              >
                d{i + 1}: {b}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: 2,
      title: "Calculate 3 Parity Bits",
      desc: "Apply even-parity XOR equations over GF(2).",
      content: (
        <div className="font-mono text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 space-y-1.5">
          <div>p1 = d1 ⊕ d2 ⊕ d4 = {dataBits[0]} ⊕ {dataBits[1]} ⊕ {dataBits[3]} = <b className="text-blue-700">{p1}</b></div>
          <div>p2 = d1 ⊕ d3 ⊕ d4 = {dataBits[0]} ⊕ {dataBits[2]} ⊕ {dataBits[3]} = <b className="text-blue-700">{p2}</b></div>
          <div>p4 = d2 ⊕ d3 ⊕ d4 = {dataBits[1]} ⊕ {dataBits[2]} ⊕ {dataBits[3]} = <b className="text-blue-700">{p4}</b></div>
        </div>
      ),
    },
    {
      num: 3,
      title: "Assemble 7-Bit Codeword",
      desc: "Place parity at powers of 2 and data in remaining slots.",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-slate-600">Format: [p1, p2, d1, p4, d2, d3, d4]</p>
          <div className="flex gap-1.5 overflow-x-auto">
            {txCodeword.map((b, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center w-10 h-12 rounded-lg bg-blue-50 border border-blue-200 font-mono font-bold text-blue-900"
              >
                <span className="text-[9px] text-slate-400">Pos {i + 1}</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: 4,
      title: "Channel Noise Injection (1 Bit Flip)",
      desc: "Thermal noise or cosmic ray flips exactly one bit.",
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            Selected bit flip at <b>Position {selectedFlipPos}</b>. Original bit was {txCodeword[selectedFlipPos - 1]}, now received as <b>{rxVector[selectedFlipPos - 1]}</b>!
          </p>
          <div className="flex gap-1.5 overflow-x-auto">
            {rxVector.map((b, i) => {
              const isFlipped = i + 1 === selectedFlipPos;
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-center w-10 h-12 rounded-lg font-mono font-bold border transition ${
                    isFlipped
                      ? "bg-red-500 border-red-600 text-white animate-pulse shadow-md"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="text-[9px] opacity-70">Pos {i + 1}</span>
                  <span>{b}</span>
                  {isFlipped && <span className="text-[8px] uppercase tracking-tighter">ERR</span>}
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      num: 5,
      title: "Evaluate Parity Equations (Syndrome)",
      desc: "Receiver calculates S = H · r^T (mod 2).",
      content: (
        <div className="font-mono text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 space-y-1.5">
          <div className={s1 === 1 ? "text-red-600 font-bold" : "text-emerald-700"}>
            s1 = r1 ⊕ r3 ⊕ r5 ⊕ r7 = {rxVector[0]} ⊕ {rxVector[2]} ⊕ {rxVector[4]} ⊕ {rxVector[6]} = {s1} ({s1 === 1 ? "FAIL" : "PASS"})
          </div>
          <div className={s2 === 1 ? "text-red-600 font-bold" : "text-emerald-700"}>
            s2 = r2 ⊕ r3 ⊕ r6 ⊕ r7 = {rxVector[1]} ⊕ {rxVector[2]} ⊕ {rxVector[5]} ⊕ {rxVector[6]} = {s2} ({s2 === 1 ? "FAIL" : "PASS"})
          </div>
          <div className={s3 === 1 ? "text-red-600 font-bold" : "text-emerald-700"}>
            s3 = r4 ⊕ r5 ⊕ r6 ⊕ r7 = {rxVector[3]} ⊕ {rxVector[4]} ⊕ {rxVector[5]} ⊕ {rxVector[6]} = {s3} ({s3 === 1 ? "FAIL" : "PASS"})
          </div>
        </div>
      ),
    },
    {
      num: 6,
      title: "Syndrome Binary-to-Decimal Localization",
      desc: "Syndrome points directly to the corrupted bit coordinate.",
      content: (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
          <p className="text-xs text-blue-900 leading-relaxed">
            Syndrome Vector: <b>[{s1}, {s2}, {s3}]</b>.<br />
            Converting to decimal: <b>s1·1 + s2·2 + s3·4 = {s1}·1 + {s2}·2 + {s3}·4 = {syndromeDec}</b>.
          </p>
          <div className="font-bold text-sm text-blue-800">
            🎯 Culprit Bit Isolated at Position: {syndromeDec} (Exact match to injected flip!)
          </div>
        </div>
      ),
    },
    {
      num: 7,
      title: "Decoder Correction & Payload Restored",
      desc: "Decoder inverts bit at position S and extracts original message.",
      content: (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Single Error Successfully Corrected!</span>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            Receiver inverted received bit at position {syndromeDec}.<br />
            Extracted Data: <b>[{decodedData.join(", ")}]</b> (Original: [{dataBits.join(", ")}]).<br />
            100% data integrity verified with zero data corruption!
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Single-Bit Error Correction Demonstration
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select any bit to flip and step through the full encoding, syndrome calculation, and 100% repair cycle.
            </p>
          </div>
        </div>
      </div>

      {/* Bit Selection & Codeword Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Interactive Single-Bit Flip Selector:</h3>
            <p className="text-xs text-slate-500">Click any position 1 to 7 to inject a channel error:</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Currently Flipping: Bit {selectedFlipPos}
          </span>
        </div>

        {/* 7 Clickable Bit Positions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7].map((pos) => {
            const isParity = pos === 1 || pos === 2 || pos === 4;
            const isSelected = selectedFlipPos === pos;
            const originalVal = txCodeword[pos - 1];
            const flippedVal = rxVector[pos - 1];

            return (
              <button
                key={pos}
                onClick={() => setSelectedFlipPos(pos)}
                className={`p-3.5 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-between shadow-xs active:scale-95 cursor-pointer ${
                  isSelected
                    ? "bg-rose-50 border-rose-500 ring-2 ring-rose-400 shadow-md scale-102"
                    : isParity
                    ? "bg-blue-50/50 hover:bg-blue-100/60 border-blue-200"
                    : "bg-emerald-50/50 hover:bg-emerald-100/60 border-emerald-200"
                }`}
              >
                <div className="flex items-center justify-between w-full text-[10px] font-bold">
                  <span className="text-slate-400">Pos {pos}</span>
                  <span className={`px-1.5 py-0.5 rounded-md ${isParity ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {pos === 1 ? "p1" : pos === 2 ? "p2" : pos === 3 ? "d1" : pos === 4 ? "p4" : `d${pos - 2}`}
                  </span>
                </div>
                <div className="font-mono text-xl font-black my-1.5 flex items-center gap-1">
                  {isSelected ? (
                    <span className="text-slate-400 line-through text-sm">{originalVal}</span>
                  ) : null}
                  <span className={isSelected ? "text-rose-600 text-2xl animate-pulse" : "text-slate-900"}>
                    {flippedVal}
                  </span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? "text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full" : "text-slate-400"}`}>
                  {isSelected ? "● Corrupted" : "Normal"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Verdict Alert */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-3 shadow-xs">
          <Zap className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950 leading-relaxed">
            <span className="font-bold text-sm block mb-0.5 text-indigo-900">
              Syndrome Decoded: S = [{s1}, {s2}, {s3}] → Position {syndromeDec}
            </span>
            <span>
              Decoder isolates error strictly at <b>Bit {syndromeDec}</b> and flips it back from {rxVector[syndromeDec - 1]} to {correctedVector[syndromeDec - 1]}.
              Payload <b>[{decodedData.join(", ")}]</b> is 100% restored without data loss!
            </span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Mode (Wizard) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              📖 Step-by-Step Mode
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Step {currentStep} of 7: {steps[currentStep - 1].title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{steps[currentStep - 1].desc}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Step
            </button>
            <button
              disabled={currentStep === 7}
              onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition shadow-sm"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex items-center justify-between gap-1">
          {steps.map((st) => (
            <button
              key={st.num}
              onClick={() => setCurrentStep(st.num)}
              className={`flex-1 py-1 text-center rounded text-[11px] font-bold transition ${
                currentStep === st.num
                  ? "bg-blue-600 text-white shadow-sm"
                  : currentStep > st.num
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200"
              }`}
            >
              Step {st.num}
            </button>
          ))}
        </div>

        {/* Step Content Area */}
        <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 min-h-[120px] flex flex-col justify-center">
          {steps[currentStep - 1].content}
        </div>
      </div>
    </div>
  );
}