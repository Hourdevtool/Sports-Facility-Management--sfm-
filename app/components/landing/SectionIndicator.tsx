"use client";

import { useState, useEffect } from "react";
import { SectionItem, SectionIndicatorProps } from "@/app/types/Scteion";


const DEFAULT_SECTIONS: SectionItem[] = [
  { id: "hero", name: "หน้าหลัก" },
  { id: "info", name: "เกี่ยวกับเรา" },
];

export default function SectionIndicator({
  sections = DEFAULT_SECTIONS,
}: SectionIndicatorProps) {
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id ?? "hero"
  );

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      // หากเลื่อนลงมาเกือบสุดหน้าเว็บ (เช่น ถึงส่วน Footer) ให้เลือก section สุดท้าย
      if (scrollPosition + viewportHeight >= documentHeight - 80) {
        if (sections.length > 0) {
          setActiveSection(sections[sections.length - 1].id);
        }
        return;
      }

      // ตรวจสอบตำแหน่งของแต่ละ section โดยอ้างอิงจากเส้นกึ่งกลางค่อนบนของหน้าจอ (45% viewport)
      const triggerPoint = viewportHeight * 0.45;
      for (let i = sections.length - 1; i >= 0; i--) {
        const targetId = sections[i].id;
        const element = document.getElementById(targetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= triggerPoint) {
            setActiveSection(targetId);
            return;
          }
        }
      }

      // ถ้าอยู่เหนือจุด trigger ทั้งหมด ให้เป็น section แรก
      if (sections[0]) {
        setActiveSection(sections[0].id);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sections]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="การนำทางระหว่างส่วนของหน้า"
      className="fixed right-4 sm:right-6 xl:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-6 sm:gap-7 select-none pointer-events-auto"
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id;

        return (
          <div
            key={section.id}
            className="relative flex items-center justify-center group"
          >
            {/* ป้ายชื่อ Section (Tooltip / Badge) ด้านซ้ายของจุด - แสดงเฉพาะตอน Hover */}
            <div
              className="absolute right-full mr-3 sm:mr-3.5 flex items-center transition-all duration-200 ease-out pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0"
            >
              <span className="bg-black text-white text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.3)] whitespace-nowrap tracking-wide">
                {section.name}
              </span>
            </div>

            {/* ปุ่มกดจุด Dot Navigation */}
            <button
              type="button"
              onClick={() => scrollToSection(section.id)}
              aria-label={`ไปยังส่วน ${section.name}`}
              aria-current={isActive ? "true" : undefined}
              className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full cursor-pointer focus:outline-none group"
            >
              <span
                className={`block rounded-full transition-all duration-300 ease-out ${
                  isActive
                    ? "w-3 h-3 sm:w-3.5 sm:h-3.5 bg-black ring-2 ring-black/25 ring-offset-2 ring-offset-transparent shadow-md scale-110"
                    : "w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white border border-black/35 shadow-sm group-hover:scale-125 group-hover:border-black"
                }`}
              />
            </button>
          </div>
        );
      })}
    </nav>
  );
}

