import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgriSense AI • Multimodal Precision Agriculture",
  description: "100% Real-Data Multimodal Decision Support System powered by Sentinel-2, ECMWF, ISRIC SoilGrids and Google Gemini 3.6 Flash",
};

import { AuthProvider } from "@/context/AuthContext";
import NetworkStatusIndicator from "@/components/NetworkStatusIndicator";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <NetworkStatusIndicator />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
