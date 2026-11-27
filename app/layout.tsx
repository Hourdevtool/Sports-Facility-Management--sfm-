import type { Metadata } from "next";
import { Bai_Jamjuree, Anuphan } from "next/font/google";
import "./globals.css";

// font settings
const baiJamjuree = Bai_Jamjuree({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-bai-jamjuree",
  display: "swap",
});

// second font
const anuphan = Anuphan({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-anuphan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SFM",
  description: "Sports Facility Management",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${baiJamjuree.variable} ${anuphan.variable} overflow-x-hidden`}
    >
      <body className="bg-white">{children}</body>
    </html>
  );
}
