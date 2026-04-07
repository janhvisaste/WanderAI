import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebas = localFont({
  src: [
    {
      path: "../fonts/BebasNeue-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-bebas",
  display: "swap",
  fallback: ["Impact", "sans-serif"],
});

export const metadata: Metadata = {
  title: "WanderAI — Smart Travel Itinerary Planner | AI-Powered Trip Planning",
  description:
    "Plan your perfect trip in seconds with AI. WanderAI generates personalized day-by-day itineraries with real places, maps, and photos.",
  keywords: [
    "travel planner", "AI itinerary", "trip planning", "smart travel", "wanderai",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable} dark`}>
      <body className="font-body antialiased">
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
