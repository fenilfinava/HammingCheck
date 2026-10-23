"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Clock, Volume2, CheckCircle2 } from "lucide-react";

interface Chapter {
  id: number;
  timeRange: string;
  durationMin: number;
  title: string;
  screenAction: string;
  spokenNarration: string;
  gujaratiNotes: string;
}

export default function LecturePrompter() {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const chapters: Chapter[] = [
    {
      id: 1,
      timeRange: "0:00 - 4:30 (4.5 min)",
      durationMin: 4.5,
      title: "1. Home: Introduction, Shannon Capacity & Historical Background",
      screenAction: "Stay on 'Home (Intro)' page. Point mouse to the Title Banner, the Error Detection vs Correction Comparison Table, and the Real-Life Applications grid.",
      spokenNarration:
        "Good morning respected evaluators, professors, and peers. Welcome to this comprehensive 35-minute technical seminar and demonstration on 'Hamming(7,4) Single vs Double Error Dynamics'. In all modern digital systems—from deep-space telemetry to high-speed DDR5 ECC RAM and solid-state storage—physical channels suffer from thermal noise, electromagnetic interference, and cosmic ray Single-Event Upsets (SEUs). In 1948, Claude Shannon proved in his seminal mathematical theory of communication that error-free communication is possible up to channel capacity, provided we introduce structured mathematical redundancy. In 1950, Richard W. Hamming at Bell Telephone Laboratories tackled a practical bottleneck: electromechanical relay computers would halt over weekend unattended runs whenever a relay spark flipped a single bit. A simple single parity bit could detect an odd number of errors, but it had ZERO localization—it could never tell which bit was corrupted, providing zero correction. Hamming's breakthrough was to arrange multiple parity checks geometrically, giving each bit a coordinate in a multi-dimensional hypercube. Today, we will explore the exact mathematical boundary of this code: guaranteed Single-Error Correction, and why double errors cause catastrophic Decoder Aliasing.",
      gujaratiNotes:
        "સમજૂતી (0:00 - 4:30): શરૂઆતમાં હોમ પેજ બતાવો. ક્લાઉડ શેનોન (1948) અને રિચાર્ડ હેમિંગ (1950) નો ઇતિહાસ કહો. સાદી પેરિટી ફક્ત એરર પકડે છે પણ સુધારી શકતી નથી. હેમિંગ કોડમાં 4 ડેટા અને 3 પેરિટી બીટ્સ હોય છે. એરર ડિટેક્શન વિ. એરર કરેક્શનનું ટેબલ અને ECC RAM, સેટેલાઇટ ના ઉપયોગો માઉસથી બતાવો.",
    },
    {
      id: 2,
      timeRange: "4:30 - 9:30 (5.0 min)",
      durationMin: 5.0,
      title: "2. Learn Hamming Code: Bit Positions, Parity Equations & Matrices",
      screenAction: "Click 'Learn Hamming Code' tab. Point to the 1-indexed power-of-2 table (p1, p2, p4), the parity equations sandbox, and Matrices G and H.",
      spokenNarration:
        "Let us navigate to 'Learn Hamming Code' to examine the mathematical architecture. All operations in Hamming(7,4) are defined over Galois Field GF(2), where addition is bitwise XOR and multiplication is AND. A codeword c belongs to vector space F_2^7. We place parity bits strictly at powers of 2: positions 1, 2, and 4 hold p1, p2, and p4. Positions 3, 5, 6, and 7 hold data bits d1, d2, d3, and d4. Why? Because in binary, position 1 is 001, position 2 is 010, and position 4 is 100! Parity equations balance these binary coordinates: p1 = d1 ⊕ d2 ⊕ d4; p2 = d1 ⊕ d3 ⊕ d4; and p4 = d2 ⊕ d3 ⊕ d4. Our 4x7 Generator Matrix G maps any 4-bit message d into a 7-bit codeword c = d · G (mod 2). Next, Parity-Check Matrix H of size 3x7 has columns that are the exact binary expansion of indices 1 through 7! Orthogonality ensures G · H^T ≡ 0 (mod 2). Since no column is zero and all columns are distinct, d_min > 2. But columns 1, 2, and 3 sum to zero, so d_min is strictly 3. Furthermore, 16 · (1 + 7) = 128 = 2^7: Hamming(7,4) is a PERFECT CODE with zero unassigned vectors!",
      gujaratiNotes:
        "સમજૂતી (4:30 - 9:30): 'Learn Hamming Code' ટેબ પર જાઓ. 1, 2, 4 સ્થાનો પર પેરિટી કેમ છે? કારણ કે તેમના બાઈનરી કોઓર્ડિનેટ્સ (001, 010, 100) છે. લાઈવ એનકોડર સેન્ડબોક્સમાં ડેટા બદલીને લાઈવ પેરિટી ગણતરી બતાવો. મેટ્રિક્સ G અને H સમજાવો અને સાબિત કરો કે d_min = 3 કેમ છે અને Perfect Code (16 x 8 = 128 = 2^7) નો અર્થ શું છે.",
    },
    {
      id: 3,
      timeRange: "9:30 - 15:00 (5.5 min)",
      durationMin: 5.5,
      title: "3. Single Error Demo: Live Bit Flip & Step-by-Step Stepper Walkthrough",
      screenAction: "Click 'Single Error Demo' tab. Click Bit 3 in the 7-bit selector. Show the red corrupted highlight and walk through the 7-step wizard using 'Next Step'.",
      spokenNarration:
        "Now let us navigate to 'Single Error Demo'. We transmit data [1, 0, 1, 1], yielding codeword [0, 1, 1, 0, 0, 1, 1]. In the top selector, I click Bit 3: notice the pulsing red highlight! Bit 3 flips from 1 to 0. Now let us explore our Step-by-Step Mode below: Step 1 shows input data [1,0,1,1]. Step 2 calculates parities p1=0, p2=1, p4=0. Step 3 forms the 7-bit codeword. Step 4 injects the channel error at position 3. Step 5 evaluates parity checks: s1 checks {1,3,5,7} which fails giving s1=1; s2 checks {2,3,6,7} which fails giving s2=1; s3 checks {4,5,6,7} which passes giving s3=0. Step 6 converts syndrome vector [1,1,0] to decimal: 1*1 + 1*2 + 0*4 = 3! The syndrome directly isolated corrupted Bit 3! Step 7: the decoder flips Bit 3 back, restoring original payload [1, 0, 1, 1] with 100% fidelity. Single-Error Correction is verified!",
      gujaratiNotes:
        "સમજૂતી (9:30 - 15:00): 'Single Error Demo' ટેબ ખોલો. બીટ 3 પર ક્લિક કરીને લાલ ફ્લિપ બતાવો. પછી નીચે આપેલા Step-by-Step Mode માં 'Next Step' દબાવતા જાઓ: Step 1 થી Step 7 સુધી દરેક ગણતરી સમજાવો. સિન્ડ્રોમ 3 આવ્યો: s1=1, s2=1, s3=0 -> 1 + 2 + 0 = 3. ડીકોડરે બીટ 3 સુધારીને ઓરિજિનલ ડેટા 100% પાછો મેળવી લીધો.",
    },
    {
      id: 4,
      timeRange: "15:00 - 21:00 (6.0 min)",
      durationMin: 6.0,
      title: "4. Double Error Demo: Single vs Double Comparison & Aliasing Catastrophe",
      screenAction: "Click 'Double Error Demo' tab. Compare Case A vs Case B side-by-side. Highlight the Cancellation equation and the Modulo-2 Vector Addition proof.",
      spokenNarration:
        "Now we arrive at the central technical dilemma: What happens when TWO bit errors occur simultaneously? Navigate to 'Double Error Demo'. On screen, we compare Case A (Single Error at Bit 3) against Case B (Double Error at Bits 3 and 5). In Case B, look at the calculated syndrome: Row 1 checks {1,3,5,7}. Because both bits 3 and 5 lie inside circle 1, their two flips cancel each other out under modulo-2 addition: 1 ⊕ 1 = 0! Check 1 falsely passes (s1 = 0)! But check 2 fails (s2 = 1) and check 3 fails (s3 = 1). The resulting syndrome is binary [0, 1, 1], which equals DECIMAL 6! Why? By linearity, S = col_3(H) ⊕ col_5(H) = [1,1,0]^T ⊕ [1,0,1]^T = [0,1,1]^T = col_6(H)! The ordinary decoder sees syndrome 6, blindly assumes a single error occurred, and FLIPS Bit 6! But Bit 6 was completely innocent and uncorrupted! Instead of fixing the 2 errors, the codeword now contains THREE CORRUPTED BITS! This is Silent Data Corruption (SDC). In 100% of all 21 possible double-error pairs, ordinary Hamming(7,4) fails catastrophically!",
      gujaratiNotes:
        "સમજૂતી (15:00 - 21:00): આ પ્રેઝન્ટેશનનો સૌથી મોટો ક્લાઈમેક્સ છે (5+4 marks)! 'Double Error Demo' ટેબમાં Case A અને Case B ની સરખામણી બતાવો. બીટ 3 અને 5 બગડ્યા, ત્યારે સર્કલ 1 માં 1 ⊕ 1 = 0 થઈને કેન્સલ થઈ ગયું! સિન્ડ્રોમ 6 આવ્યો કારણ કે col 3 + col 5 = col 6 થાય છે! ડીકોડરે માન્યું કે બીટ 6 ખરાબ છે એટલે એણે સાચા બીટ 6 ને પણ ફ્લિપ કરી નાખ્યો. આમ 2 ની જગ્યાએ 3 ભૂલો થઈ ગઈ. આને 'Silent Data Corruption' કહેવાય.",
    },
    {
      id: 5,
      timeRange: "21:00 - 26:30 (5.5 min)",
      durationMin: 5.5,
      title: "5. Interactive Simulator: Master Sandbox, Clickable Codeword & Live Venn",
      screenAction: "Click 'Interactive Simulator' tab. Demonstrate clicking bits in the 7-bit codeword bar, test the 'Pristine', 'Single Error', and 'Double Error' presets, and show the live Venn diagram.",
      spokenNarration:
        "Let us navigate to the crown jewel of our suite: the 'Interactive Simulator'. Here, the user has full hands-on freedom. We have a 4-bit message input, a live 7-bit codeword bar, and an interactive geometric Venn Diagram on the right. When I click '🟢 Pristine', all parity circles are blue, syndrome is [0,0,0], and payload is intact. When I click '🔵 Single Error (Bit 3)', Circles 1 and 2 turn red, isolating Bit 3. Now watch when I click '🔴 Double Error (Bits 3 & 5)': Circle 1 turns blue due to cancellation, while Circles 2 and 3 turn red, falsely pointing to Bit 6! Look at the live matrix multiplication table below: every single row calculation is traced in real time. We also observe the Extended SECDED status card showing how an 8th parity bit detects the double error without corruption. This simulator provides absolute empirical clarity!",
      gujaratiNotes:
        "સમજૂતી (21:00 - 26:30): 'Interactive Simulator' ટેબ પર જાઓ. આ વેબસાઈટનો મુખ્ય હાઈલાઈટ છે! 'Pristine' બટન દબાવીને 000 બતાવો. પછી 'Single Error' દબાવો -> Venn Diagram માં સર્કલ 1 અને 2 લાલ થયા. પછી 'Double Error' દબાવો -> સર્કલ 1 બ્લુ (કેન્સલ) થયું અને સર્કલ 2 અને 3 નું છેદબિંદુ બીટ 6 બન્યું. નીચેનું લાઈવ મેટ્રિક્સ ગુણાકાર ટેબલ માઉસથી બતાવો.",
    },
    {
      id: 6,
      timeRange: "26:30 - 31:30 (5.0 min)",
      durationMin: 5.0,
      title: "6. Results & Exam Answer: Test Cases Panel & Worked University Paper",
      screenAction: "Click 'Results & Exam Answer' tab. Show the Test Cases Panel with filter buttons, walk through the Model Exam Paper Solution (Parts a, b, c, d), and click 'Export CSV Evidence'.",
      spokenNarration:
        "Now navigate to 'Results & Exam Answer'. This tab provides complete empirical validation and academic documentation. In our Automated Test Cases Panel, we evaluate clean channels, all 7 single errors, and multiple double errors. Notice the filter buttons: clicking 'Double Errors' reveals how in every case, final corrupted bits increase to 3! Below this, we provide a complete, step-by-step Model Exam Paper Solution formatted for university examinations: Part (a) shows codeword generation for d=[1,0,1,1]; Part (b) provides single-error detection at bit 3; Part (c) proves double-error aliasing at bits 3 and 5; and Part (d) demonstrates the Extended SECDED resolution. I click 'Export CSV Evidence' to download the complete trial records for archival.",
      gujaratiNotes:
        "સમજૂતી (26:30 - 31:30): 'Results & Exam Answer' ટેબ ખોલો. ઉપરનું ટેસ્ટ કેસોનું ટેબલ બતાવો અને ફિલ્ટર બટન દબાવો. પછી નીચે આપેલું 'Model Exam Paper Answer' બતાવો: Part (a) માં કોડવર્ડ કેવી રીતે બન્યો, Part (b) માં 1-error કેવી રીતે સુધરી, Part (c) માં 2-errors માં કેમ 3 ભૂલો થઈ, અને Part (d) માં SECDED કેવી રીતે બચાવે છે તે સ્ટેપ-બાય-સ્ટેપ સમજાવો. 'Export CSV Evidence' બટન દબાવો.",
    },
    {
      id: 7,
      timeRange: "31:30 - 35:00 (3.5 min)",
      durationMin: 3.5,
      title: "7. Conclusion, Practical Applications & Oral Viva Defense",
      screenAction: "Stay on 'Results & Exam Answer' or return to 'Home'. Review the error correction limitations, summarize modern applications (DDR5 ECC RAM, NASA), and answer 2 Viva questions.",
      spokenNarration:
        "In conclusion, our technical investigation demonstrates that Hamming(7,4) achieves optimal 1-bit error correction as a perfect linear block code, but suffers from universal decoder aliasing under 2-bit channel flips. In modern mission-critical engineering—such as server ECC RAM, NASA spacecraft telemetry, and solid-state flash memory—engineers strictly mandate Extended Hamming(8,4) SECDED to detect double errors and prevent silent data corruption. Before concluding, let us address two critical oral exam defense questions: 1. 'Can Hamming(7,4) detect 2 errors?' Yes, but only if error correction is disabled. Simultaneous correction and 2-error detection requires minimum distance 4 via SECDED. 2. 'Why is Hamming(7,4) called linear?' Because the modulo-2 XOR sum of any two valid codewords is also a valid codeword. Thank you very much for your time, attention, and evaluation!",
      gujaratiNotes:
        "સમજૂતી (31:30 - 35:00): છેલ્લી 3.5 મિનિટમાં કન્ક્લુઝન આપો. હેમિંગ કોડ 1-error માટે પરફેક્ટ છે પણ 2-errors માટે હંમેશા SECDED (8-bit) જ વપરાય છે. Viva ના બંને પ્રશ્નો કોન્ફિડન્સથી બોલી જાઓ. આ રીતે સંપૂર્ણ 35 મિનિટમાં તમારો વિડીયો પૂરો થશે અને 20 માંથી પૂરા 20 માર્ક્સ મળશે!",
    },
  ];

  const currentCh = chapters[currentChapterIndex];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Top Banner: Video Recording Controller */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
            🎬 30-35 Minute Video Teleprompter & Recording Guide
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            {currentCh.title}
          </h2>
        </div>

        {/* Stopwatch & Controls */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <Clock className="w-5 h-5 text-emerald-600" />
          <span className="font-mono text-xl font-bold text-slate-900">
            {formatTime(secondsElapsed)} / 35:00
          </span>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-2 rounded-lg text-white font-semibold transition ${
              isRunning ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsElapsed(0);
            }}
            className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chapter Progress Carousel Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {chapters.map((ch, idx) => (
          <button
            key={ch.id}
            onClick={() => setCurrentChapterIndex(idx)}
            className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between ${
              currentChapterIndex === idx
                ? "bg-blue-50 border-blue-600 ring-2 ring-blue-500 shadow-sm"
                : "bg-slate-50 hover:bg-slate-100 border-slate-200"
            }`}
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase">Part {ch.id}</span>
            <span className="text-xs font-bold text-slate-800 line-clamp-1">{ch.title.split(":")[0]}</span>
            <span className="text-[10px] text-blue-700 font-mono mt-1">{ch.timeRange.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Main Prompter Body */}
      <div className="space-y-5 bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
        {/* On-Screen Web Action Box */}
        <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-950">
          <span className="font-bold uppercase tracking-wider block mb-1 text-cyan-800">
            🖥️ On-Screen Web Action (તમારે સ્ક્રીન પર શું ક્લિક કરવું):
          </span>
          {currentCh.screenAction}
        </div>

        {/* Spoken English Dialogue */}
        <div className="p-5 rounded-xl bg-white border border-slate-300 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider">
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span>Spoken Narration Script (Word-for-Word English to Speak in Video):</span>
          </div>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-serif">
            &ldquo;{currentCh.spokenNarration}&rdquo;
          </p>
        </div>

        {/* Gujarati Concept Explanation */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-amber-950 leading-relaxed">
          <span className="font-bold block mb-1 text-amber-900">
            💡 ગુજરાતી સમજૂતી (Concept Guidance in Gujarati):
          </span>
          {currentCh.gujaratiNotes}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          disabled={currentChapterIndex === 0}
          onClick={() => setCurrentChapterIndex((prev) => Math.max(0, prev - 1))}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Chapter
        </button>

        <span className="text-xs font-semibold text-slate-500">
          Chapter {currentChapterIndex + 1} of {chapters.length} ({currentCh.timeRange})
        </span>

        <button
          disabled={currentChapterIndex === chapters.length - 1}
          onClick={() => setCurrentChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1))}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition shadow-sm"
        >
          Next Chapter <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}