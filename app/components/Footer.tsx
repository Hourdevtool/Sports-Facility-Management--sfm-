  "use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <>
      {/* ปุ่มกลับสู่ด้านบนแบบลอยตัว (Floating Action Button) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="กลับสู่ด้านบน"
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-footer-bg/90 border border-white/20 text-white shadow-[0_10px_25px_rgba(0,0,0,0.5)] backdrop-blur-md hover:bg-brand-blue hover:border-brand-blue/50 active:scale-95 transition-all duration-300 group cursor-pointer ${
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <svg
          className="w-5 h-5 text-brand-yellow group-hover:text-white group-hover:-translate-y-0.5 transition-all duration-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {/* ตัว Footer หลัก */}
      <footer className="w-full bg-footer-bg text-white border-t border-white/10 select-none">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10">
          
          {/* ตารางเนื้อหาหลัก 4 คอลัมน์ (ขนาดกระชับและรองรับ Responsive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* คอลัมน์ที่ 1: แบรนด์และพันธกิจระบบ */}
            <div className="flex flex-col gap-3">
              <Link href="/" className="flex items-center gap-3 group w-fit">
                <div className="relative w-8 h-8 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm">
                  <Image
                    src="/icon.svg"
                    width={22}
                    height={22}
                    alt="SFM Icon"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-primary font-bold text-lg leading-tight tracking-tight text-white group-hover:text-brand-yellow transition-colors">
                    SFM
                  </span>
                  <span className="font-secondary text-[11px] text-slate-300 font-light leading-none mt-0.5">
                    Sports Facility Management
                  </span>
                </div>
              </Link>
              <p className="font-secondary text-xs sm:text-[13px] text-slate-300 leading-relaxed max-w-xs mt-1">
                ระบบจัดการสนามกีฬาภายในชุมชนครบวงจร เพื่อส่งเสริมสุขภาพ สุขภาวะ และการออกกำลังกายของประชาชนอย่างทั่วถึง
              </p>
            </div>

            {/* คอลัมน์ที่ 2: เมนูระบบหลัก */}
            <div className="flex flex-col gap-3">
              <h4 className="font-primary font-semibold text-sm sm:text-[15px] text-white tracking-wide">
                เมนูระบบ
              </h4>
              <ul className="flex flex-col gap-2 font-secondary text-xs sm:text-[13px]">
                <li>
                  <Link href="/" className="text-slate-300 hover:text-brand-yellow transition-colors">
                    หน้าหลัก
                  </Link>
                </li>
                <li>
                  <Link href="/booking" className="text-slate-300 hover:text-brand-yellow transition-colors">
                    จองสนาม
                  </Link>
                </li>
                <li>
                  <Link href="/reportproplem" className="text-slate-300 hover:text-brand-yellow transition-colors">
                    แจ้งปัญหาการใช้งาน
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-slate-300 hover:text-brand-yellow transition-colors">
                    ข่าวสารและประชาสัมพันธ์
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-slate-300 hover:text-brand-yellow transition-colors">
                    สมัครสมาชิกผู้ใช้บริการ
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-slate-300 hover:text-brand-yellow transition-colors">
                    เข้าสู่ระบบ
                  </Link>
                </li>
              </ul>
            </div>

            {/* คอลัมน์ที่ 3: ระบบช่วยเหลือและผู้ใช้งาน */}
            <div className="flex flex-col gap-3">
              <h4 className="font-primary font-semibold text-sm sm:text-[15px] text-white tracking-wide">
                ช่วยเหลือและบริการ
              </h4>
              <ul className="flex flex-col gap-2 font-secondary text-xs sm:text-[13px] text-slate-300">
         
                <li>
                  <Link href="/reportproplem" className="hover:text-brand-yellow transition-colors">
                    แจ้งเหตุขัดข้องทางเทคนิค
                  </Link>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-brand-yellow transition-colors">
                    ระเบียบการใช้สนามและอุปกรณ์
                  </span>
                </li>
              </ul>
            </div>

            {/* คอลัมน์ที่ 4: เวลาทำการและช่องทางติดต่อ (ไม่มีที่อยู่และไม่เน้นโซเชียลตามที่กำหนด) */}
            <div className="flex flex-col gap-3">
              <h4 className="font-primary font-semibold text-sm sm:text-[15px] text-white tracking-wide">
                เวลาทำการและติดต่อ
              </h4>
              
             

              <div className="flex flex-col gap-2.5 font-secondary text-xs sm:text-[13px] text-slate-300 mt-0.5">
                <div className="flex items-center gap-2.5">
                  <svg className="w-3.5 h-3.5 text-brand-yellow shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>โทรศัพท์: 02-123-4567</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="w-3.5 h-3.5 text-brand-yellow shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>อีเมล: contact@sfm-community.go.th</span>
                </div>
              </div>
            </div>

          </div>

          {/* แถวล่างสุด: ลิขสิทธิ์และข้อตกลงทางกฎหมาย */}
          <div className="pt-6 mt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs font-secondary text-slate-400">
            <p>© 2026 SFM (Sports Facility Management). สงวนลิขสิทธิ์ทั้งหมด</p>
            <div className="flex flex-wrap items-center gap-5">
              <span className="hover:text-slate-200 transition-colors cursor-pointer">
                นโยบายความเป็นส่วนตัว (Privacy Policy)
              </span>
              <span className="hover:text-slate-200 transition-colors cursor-pointer">
                ข้อกำหนดและเงื่อนไข (Terms of Service)
              </span>
              <span className="hover:text-slate-200 transition-colors cursor-pointer">
                มาตรการคุ้มครองข้อมูล (PDPA)
              </span>
            </div>
          </div>

        </div>
      </footer>
    </>
  )
}
