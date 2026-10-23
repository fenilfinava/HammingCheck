"use client";

import React from "react";
import {
  ShieldCheck,
  Cpu,
  HardDrive,
  Radio,
  Layers,
  ArrowRight,
  CheckCircle2,
  Play,
  AlertTriangle,
  Activity,
} from "lucide-react";

interface HomeIntroProps {
  onNavigate: (tabId: string) => void;
}

export default function HomeIntro({ onNavigate }: HomeIntroProps) {
  return (
    <div className="space-y-8">
      {/* Hero Banner (Clean Light UI Theme) */}
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 border border-slate-200/90 rounded-3xl p-7 sm:p-9 lg:p-10 shadow-xs relative overflow-hidden">
        {/* Subtle Decorative Ambient Background */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, Academic Badges & Action Buttons */}
          <div className="xl:col-span-7 space-y-4">
            {/* Academic Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 text-blue-900 text-xs font-bold shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>🎓 Academic Defense &amp; Simulation Suite</span>
              <span className="h-3 w-px bg-slate-200 hidden sm:block"></span>
              <span className="text-[11px] font-mono text-blue-600 hidden sm:inline">Hamming(7,4) Engine</span>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Hamming(7,4){" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-900">
                Single vs. Double Error
              </span>{" "}
              Dynamics
            </h1>

            {/* Description Subtitle */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
              A comprehensive, mathematically rigorous platform demonstrating why ordinary Hamming(7,4) guarantees{" "}
              <span className="text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                100% Single-Error Correction (SEC)
              </span>
              , but catastrophically fails under{" "}
              <span className="text-rose-800 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                Double-Bit Errors due to Decoder Aliasing
              </span>
              —and how Extended SECDED Hamming(8,4) resolves the vulnerability.
            </p>

            {/* The 3 Action Buttons with Polished Styling & Animations */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {/* Button 1: Launch Interactive Simulator */}
              <button
                onClick={() => onNavigate("simulator")}
                className="group relative inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* Shimmer sweep */}
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 ease-in-out pointer-events-none" />
                
                <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-white/20 text-white">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </span>
                <span className="tracking-wide">Launch Interactive Simulator</span>
                <ArrowRight className="w-4 h-4 text-white/90 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Button 2: Single Error Demo */}
              <button
                onClick={() => onNavigate("single")}
                className="group inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50/90 hover:bg-emerald-100/90 text-emerald-800 border-2 border-emerald-300 hover:border-emerald-400 font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Single Error Demo</span>
                <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900 border border-emerald-300">
                  100% SEC
                </span>
              </button>

              {/* Button 3: Double Error Aliasing Demo */}
              <button
                onClick={() => onNavigate("double")}
                className="group inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50/90 hover:bg-rose-100/90 text-rose-800 border-2 border-rose-300 hover:border-rose-400 font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600 group-hover:rotate-12 transition-transform" />
                <span>Double Error Aliasing Demo</span>
                <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-rose-200/80 text-rose-900 border border-rose-300">
                  Aliasing Alert
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Clean Light Codeword Stream Card (No Overlap) */}
          <div className="xl:col-span-5 flex justify-center xl:justify-end">
            <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
                  <span className="font-extrabold text-xs tracking-wider text-slate-800">Hamming(7,4) Codeword</span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  GF(2) Binary
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Transmitted Vector:</span>
                <div className="grid grid-cols-7 gap-1">
                  {[
                    { tag: "p1", val: 0, p: true },
                    { tag: "p2", val: 1, p: true },
                    { tag: "d1", val: 1, p: false },
                    { tag: "p4", val: 0, p: true },
                    { tag: "d2", val: 0, p: false },
                    { tag: "d3", val: 1, p: false },
                    { tag: "d4", val: 1, p: false },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-center transition-all ${
                        item.p
                          ? "bg-blue-50/80 border-blue-200 text-blue-800"
                          : "bg-emerald-50/80 border-emerald-200 text-emerald-800"
                      }`}
                    >
                      <span className="text-[9px] font-mono text-slate-400">{item.tag}</span>
                      <span className="font-mono font-bold text-xs">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px] font-mono">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Syndrome Math:</span>
                  <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                    S = H · rᵀ (mod 2)
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Sphere Packing:</span>
                  <span className="text-emerald-700 font-bold">128 / 128 (Perfect Code)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  <span>Interactive Engine Ready</span>
                </span>
                <span className="text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  t = 1 (SEC)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: What is Hamming Code? */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs anim-card space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm border border-blue-200 shadow-2xs">
            01
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">What is Hamming Code?</h2>
            <p className="text-xs text-slate-500">Historical Origin &amp; Mathematical Conception (Richard W. Hamming, 1950)</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          In 1948–1950, <b>Richard W. Hamming</b> at Bell Telephone Laboratories was frustrated by the reliability of
          electromechanical relay-based computers (like the Bell Model V). During unattended weekend runs, relay sparking
          or punch-card read faults would flip a single binary bit. The computer would detect the error using a basic
          parity bit and simply halt, aborting hours of scientific computation.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Hamming realized: <i>&ldquo;If the computer can detect that an error occurred, why can it not also identify which bit is wrong and correct it automatically?&rdquo;</i>
          He pioneered the concept of inserting <b>multiple, geometrically overlapping parity-check bits</b> whose combined evaluation
          (called a <b>syndrome</b>) provides the exact binary coordinate of the corrupted bit.
        </p>

        {/* Error Detection vs Error Correction Table */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span>⚖️ Error Detection vs. Error Correction: A Fundamental Comparison</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-xs text-left border-collapse overflow-hidden">
              <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3 border-b border-r border-slate-200">Error Scheme</th>
                  <th className="p-3 border-b border-r border-slate-200">Parity Overhead</th>
                  <th className="p-3 border-b border-r border-slate-200">Detection Capability</th>
                  <th className="p-3 border-b border-r border-slate-200">Correction Capability</th>
                  <th className="p-3 border-b border-slate-200">System Behavior upon Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-semibold text-slate-800 border-r border-slate-200">Single Parity Bit</td>
                  <td className="p-3 border-r border-slate-200">1 bit (Low)</td>
                  <td className="p-3 border-r border-slate-200 text-amber-700 font-medium">Odd number of errors (1, 3, 5...)</td>
                  <td className="p-3 border-r border-slate-200 text-rose-600 font-bold">0 bits (Zero Localization)</td>
                  <td className="p-3">Halts or requests retransmission (ARQ)</td>
                </tr>
                <tr className="hover:bg-blue-50/50 bg-blue-50/25 transition-colors">
                  <td className="p-3 font-bold text-blue-900 border-r border-slate-200">Ordinary Hamming(7,4)</td>
                  <td className="p-3 border-r border-slate-200">3 bits (42.8% overhead)</td>
                  <td className="p-3 border-r border-slate-200 text-emerald-700 font-bold">Up to 2 errors (if not correcting)</td>
                  <td className="p-3 border-r border-slate-200 text-blue-700 font-bold">Guaranteed 1-Bit Correction</td>
                  <td className="p-3">Flips suspect bit; Aliases catastrophically on 2 errors!</td>
                </tr>
                <tr className="hover:bg-emerald-50/50 bg-emerald-50/20 transition-colors">
                  <td className="p-3 font-semibold text-emerald-900 border-r border-slate-200">Extended Hamming(8,4) SECDED</td>
                  <td className="p-3 border-r border-slate-200">4 bits (50% overhead)</td>
                  <td className="p-3 border-r border-slate-200 text-emerald-700 font-bold">2 errors reliably detected</td>
                  <td className="p-3 border-r border-slate-200 text-emerald-700 font-bold">1-Bit Error Correction</td>
                  <td className="p-3">Fixes 1 error; Triggers alarm on 2 errors without data corruption</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 2: Real-Life Applications */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs anim-card space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm border border-emerald-200 shadow-2xs">
            02
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Real-Life Applications of Hamming Codes</h2>
            <p className="text-xs text-slate-500">Where Error Correction is Mission-Critical</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-400/80 anim-card group cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3 shadow-2xs group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">Server DDR4 / DDR5 ECC RAM</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Data center memory suffers from cosmic ray Single-Event Upsets (SEUs). Hardware ECC controllers use Extended
              Hamming codes to correct single-bit flips on-the-fly without server crashes.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-400/80 anim-card group cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 shadow-2xs group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Radio className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">Deep-Space Satellite Telemetry</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              NASA satellites, Voyager probes, and GPS spacecraft beam signals across millions of kilometers of noisy space,
              using forward error correction (FEC) to reconstruct attenuated data packets.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-400/80 anim-card group cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 shadow-2xs group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <HardDrive className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">Solid-State Drives &amp; Flash NAND</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Floating-gate flash memory cells experience charge leakage over time. Internal memory controllers apply
              Hamming and BCH codes to prevent silent file corruption.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-amber-400/80 anim-card group cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3 shadow-2xs group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-800 transition-colors">RAID-2 Storage Subsystems</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Legacy fault-tolerant disk arrays strip data at the bit level across data disks and compute Hamming parity
              across dedicated parity disks for real-time recovery.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Project Objectives */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs anim-card space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-black text-sm border border-purple-200 shadow-2xs">
            03
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Project Demonstration Objectives</h2>
            <p className="text-xs text-slate-500">Core Technical Objectives &amp; Evaluation Metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl border-2 border-blue-200 bg-blue-50/40 hover:bg-blue-50/80 hover:border-blue-400 anim-card space-y-2 cursor-pointer shadow-2xs">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>1. Single-Error Correction (SEC)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Demonstrate mathematically and interactively that for any 4-bit message and any of the 7 possible single-bit
              flips, the syndrome strictly equals the corrupted position and is restored with 100% fidelity.
            </p>
          </div>

          <div className="p-5 rounded-2xl border-2 border-rose-200 bg-rose-50/40 hover:bg-rose-50/80 hover:border-rose-400 anim-card space-y-2 cursor-pointer shadow-2xs">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <span>2. Double-Error Aliasing Failure</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prove algebraically that when TWO bits flip, their parity checks cancel out in shared circles, producing a false
              syndrome that matches an innocent third bit, resulting in 3 corrupted bits and Silent Data Corruption.
            </p>
          </div>

          <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/80 hover:border-emerald-400 anim-card space-y-2 cursor-pointer shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>3. SECDED Engineering Solution</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Show how appending an 8th overall parity bit (p0) increases minimum distance from d_min = 3 to d_min = 4,
              enabling the decoder to reliably detect double errors and prevent false corrections.
            </p>
          </div>
        </div>

        {/* Quick Guide Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 anim-card-sm">
          <div className="text-xs text-slate-600">
            <span className="font-bold text-slate-800">Ready to explore?</span> Navigate to{" "}
            <b>Learn Hamming Code</b> to study the 1-indexed structure and parity equations, or jump directly to the{" "}
            <b>Interactive Simulator</b>.
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onNavigate("learn")}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-800 hover:text-blue-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              Learn Code Structure →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}