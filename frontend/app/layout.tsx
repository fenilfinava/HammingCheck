import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hamming(7,4) Single vs Double Error Demonstration Suite",
  description: "Clean, comprehensive academic demonstration suite for Hamming(7,4) Single-Error Correction, Decoder Aliasing, and SECDED.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
