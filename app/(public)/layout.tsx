import type { ReactNode } from "react";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default function PublicLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
