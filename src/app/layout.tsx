import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import SessionWrapper from "../components/SessionWrapper";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata = {
  title: "Modern Platform",
  description: "A modern, feature-rich platform built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body className="font-sans bg-white">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
