"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HomeIntro from "../components/HomeIntro";
import LearnHamming from "../components/LearnHamming";
import SingleErrorDemo from "../components/SingleErrorDemo";
import DoubleErrorDemo from "../components/DoubleErrorDemo";
import InteractiveStudio from "../components/InteractiveStudio";
import ResultsExamAnswer from "../components/ResultsExamAnswer";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Check backend health
  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (res.ok) setIsBackendConnected(true);
      })
      .catch(() => setIsBackendConnected(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendConnected={isBackendConnected}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "home" && <HomeIntro onNavigate={setActiveTab} />}
        {activeTab === "learn" && <LearnHamming />}
        {activeTab === "single" && <SingleErrorDemo />}
        {activeTab === "double" && <DoubleErrorDemo />}
        {activeTab === "simulator" && <InteractiveStudio />}
        {activeTab === "results" && <ResultsExamAnswer />}
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-slate-700">Hamming(7,4) Single vs. Double Error Demonstration Platform</span>
          <span className="text-slate-500">Information Theory & Coding Dynamics • Extended SECDED</span>
        </div>
      </footer>
    </div>
  );
}
