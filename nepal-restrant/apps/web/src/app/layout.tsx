import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Haveli Restaurant — Authentic Himalayan Cuisine",
  description:
    "Experience the rich flavors of authentic Nepali and Himalayan cuisine at Haveli Restaurant. Order from your table with our seamless QR-based system.",
  keywords: "Haveli, restaurant, Nepali food, momo, thukpa, authentic cuisine",
  openGraph: {
    title: "Haveli Restaurant",
    description: "Authentic Himalayan cuisine with a premium dining experience",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-background text-text-primary antialiased">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e1e1e",
              color: "#f5f0e8",
              border: "1px solid rgba(212, 168, 83, 0.3)",
            },
            success: {
              iconTheme: { primary: "#d4a853", secondary: "#0a0a0a" },
            },
            error: {
              iconTheme: { primary: "#c0392b", secondary: "#f5f0e8" },
            },
          }}
        />
      </body>
    </html>
  );
}
