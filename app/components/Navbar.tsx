"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { MenuItem } from "@/types/ui/MenuItem"

function Navbar() {
  const pathName = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const hasMountedRef = useRef(false)

  // คงคำศัพท์เดิมทั้งหมด
  const menulist: MenuItem[] = [
    {
      path: "/",
      name: "หน้าหลัก"
    },
    {
      path: "/booking",
      name: "จองสนาม"
    },
    {
      path: "/reportproplem",
      name: "แจ้งปัญหา"
    },
    {
      path: "/news",
      name: "ประชาสัมพันธ์"
    }
  ]

  // GSAP Dynamic Island Opening Animation (คงรูปทรง Notch เดิมไว้ทั้งหมด)
  useEffect(() => {
    const navEl = navRef.current
    if (!navEl) return

    const mm = gsap.matchMedia()

    mm.add(
      {
        isMotionAllowed: "(prefers-reduced-motion: no-preference)",
        isReducedMotion: "(prefers-reduced-motion: reduce)"
      },
      (context) => {
        const { isMotionAllowed } = context.conditions as {
          isMotionAllowed: boolean
          isReducedMotion: boolean
        }

        if (!isMotionAllowed) {
          gsap.set(
            [
              navEl,
              ".gsap-nav-corner",
              ".gsap-nav-brand",
              ".gsap-nav-item",
              ".gsap-nav-action",
              ".gsap-nav-mobile-btn"
            ],
            { clearProps: "all" }
          )
          return
        }

        const tl = gsap.timeline({ delay: 0.12 })

        // เริ่มต้นจากขนาดแคปซูลเล็กตรงกลางด้านบนคล้าย Dynamic Island ก่อนขยายออกเป็นทรง Notch เต็มความกว้าง
        gsap.set(navEl, {
          scaleX: 0.28,
          scaleY: 0.52,
          y: -16,
          opacity: 0,
          filter: "blur(6px)",
          transformOrigin: "50% 0%"
        })

        gsap.set(".gsap-nav-corner", {
          opacity: 0,
          scale: 0.4,
          transformOrigin: "50% 0%"
        })

        gsap.set(
          [
            ".gsap-nav-brand",
            ".gsap-nav-item",
            ".gsap-nav-action",
            ".gsap-nav-mobile-btn"
          ],
          {
            opacity: 0,
            y: -8,
            scale: 0.92,
            filter: "blur(4px)"
          }
        )

        // จังหวะที่ 1: หยดตัวลงมาจากขอบจอด้านบนเป็นเม็ด Dynamic Island
        tl.to(navEl, {
          scaleX: 0.42,
          scaleY: 0.86,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.28,
          ease: "power3.out"
        })
          // จังหวะที่ 2: ดีดขยายด้านข้างออกเป็นรูปทรง Notch เต็มขนาดด้วย Spring แบบ iOS
          .to(navEl, {
            scaleX: 1,
            scaleY: 1,
            duration: 0.68,
            ease: "back.out(1.6)"
          })
          // มุมเว้าซ้าย-ขวาปรากฏขึ้นรับกับขอบบนอย่างแนบเนียน
          .to(
            ".gsap-nav-corner",
            {
              opacity: 1,
              scale: 1,
              duration: 0.35,
              ease: "power2.out"
            },
            "-=0.45"
          )
          // โลโก้ เมนู และปุ่มด้านใน ค่อยๆ เผยตัวเรียงลำดับจากด้านใน
          .to(
            [
              ".gsap-nav-brand",
              ".gsap-nav-item",
              ".gsap-nav-action",
              ".gsap-nav-mobile-btn"
            ],
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.45,
              stagger: 0.04,
              ease: "expo.out",
              clearProps: "filter,transform"
            },
            "-=0.42"
          )
      },
      navEl
    )

    return () => mm.revert()
  }, [])

  // Dynamic Island Elastic Pulse เมื่อกดเปิด/ปิดเมนูบนมือถือ
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    const navEl = navRef.current
    if (!navEl) return

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReduced) return

    gsap.fromTo(
      navEl,
      { scaleX: 0.97, transformOrigin: "50% 0%" },
      {
        scaleX: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.55)"
      }
    )
  }, [mobileMenuOpen])

  return (
    <>
      {/* Backdrop Overlay เมื่อเปิดเมนูบนมือถือ */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4 flex flex-col items-center">
        {/* Top Notch Tab: เป็นแผ่นสีดำชิ้นเดียวไร้รอยต่อ (ติดเป็นอันเดียวกันตามต้นแบบ Supaste) */}
        <nav
          ref={navRef}
          className={`relative w-[calc(100vw-2rem)] max-w-md lg:w-auto lg:max-w-max bg-[#0a0a0a] text-white border-x border-b border-white/15 px-6 pt-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-[border-radius,padding,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
            mobileMenuOpen
              ? "rounded-b-[2.5rem] pb-6"
              : "rounded-b-2xl sm:rounded-b-3xl pb-3.5"
          }`}
        >
          {/* ตัวเว้าด้านซ้าย (Left Inverted Concave Corner 20px) */}
          <div className="gsap-nav-corner absolute -left-[19px] top-0 w-5 h-5 pointer-events-none">
            <svg viewBox="0 0 20 20" className="w-full h-full text-[#0a0a0a] fill-current">
              <path d="M0 0 H20 V20 A20 20 0 0 0 0 0 Z" />
              <path d="M0 0 A20 20 0 0 1 20 20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            </svg>
          </div>

          {/* ตัวเว้าด้านขวา (Right Inverted Concave Corner 20px) */}
          <div className="gsap-nav-corner absolute -right-[19px] top-0 w-5 h-5 pointer-events-none scale-x-[-1]">
            <svg viewBox="0 0 20 20" className="w-full h-full text-[#0a0a0a] fill-current">
              <path d="M0 0 H20 V20 A20 20 0 0 0 0 0 Z" />
              <path d="M0 0 A20 20 0 0 1 20 20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            </svg>
          </div>

          {/* แถบด้านบน: Logo, Menu Desktop และปุ่ม Hamburger/Close */}
          <div className="flex items-center justify-between gap-6 sm:gap-10 w-full">
            {/* ด้านซ้าย: Brand Icon (สี่เหลี่ยมสีขาว) + ชื่อระบบ */}
            <Link href="/" className="gsap-nav-brand flex items-center gap-3 group shrink-0">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden bg-white p-1.5 flex items-center justify-center shadow-md">
                <Image
                  src="/icon.svg"
                  width={26}
                  height={26}
                  alt="SFM Icon"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-blue-300 transition-colors whitespace-nowrap">
                SFM
              </span>
            </Link>

            {/* ตรงกลาง: รายการเมนูบน Desktop (ฟอนต์ใหญ่ กว้างขึ้น และห้ามตัดบรรทัด) */}
            <ul className="hidden lg:flex items-center gap-2 xl:gap-3">
              {menulist.map((menu, index) => {
                const isActive = pathName === menu.path
                return (
                  <li key={index} className="gsap-nav-item">
                    <Link
                      href={menu.path}
                      className={`whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200 block ${
                        isActive
                          ? "text-white font-semibold bg-white/15 shadow-inner"
                          : "text-zinc-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {menu.name}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* ด้านขวาบน Desktop: ปุ่มสมัครใช้งาน + ปุ่มเข้าสู่ระบบแคปซูลขาว */}
            <div className="gsap-nav-action hidden lg:flex items-center gap-4 shrink-0">
              <Link
                href="/register"
                className="whitespace-nowrap text-sm font-medium text-zinc-300 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/5"
              >
                สมัครใช้งาน
              </Link>
              <Link
                href="/login"
                className="whitespace-nowrap flex items-center gap-2 bg-white text-black text-sm font-bold px-6 py-2.5 rounded-full shadow-md hover:bg-zinc-200 transition-all duration-150 active:scale-95"
              >
                เข้าสู่ระบบ
              </Link>
            </div>

            {/* ปุ่ม Hamburger / X บน Mobile (Animates ระหว่าง 3 ขีด กับ กากบาท X) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="gsap-nav-mobile-btn lg:hidden w-10 h-10 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 active:scale-95 transition-colors flex flex-col items-center justify-center gap-1.5 focus:outline-none"
              aria-label={mobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
            >
              <span
                className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 transform origin-center ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0 scale-0" : "opacity-100"
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 transform origin-center ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>

          {/* เนื้อหา Dropdown บน Mobile (อยู่ในผืนสีดำชิ้นเดียวกัน ไร้รอยต่อ ไร้ช่องว่าง สไตล์ Supaste) */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mobileMenuOpen
                ? "max-h-[600px] opacity-100 pt-6 pointer-events-auto"
                : "max-h-0 opacity-0 pointer-events-none pt-0"
            }`}
          >
            {/* รายการเมนูแนวตั้งขนาดใหญ่ สวยงาม สไตล์ Supaste */}
            <div className="flex flex-col gap-2 pb-6">
              {menulist.map((menu, index) => {
                const isActive = pathName === menu.path
                return (
                  <Link
                    key={index}
                    href={menu.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-2xl font-semibold py-2.5 px-1 transition-colors duration-150 block ${
                      isActive
                        ? "text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>{menu.name}</span>
                  </Link>
                )
              })}

              {/* สมัครใช้งาน */}
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-medium text-zinc-400 hover:text-white py-2 px-1 transition-colors block"
              >
                สมัครใช้งาน
              </Link>
            </div>

            {/* ปุ่มเข้าสู่ระบบสีขาว เต็มความกว้าง (สไตล์ปุ่ม Download สีขาวของ Supaste) */}
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-white text-black py-4 px-6 rounded-full font-bold text-base shadow-xl text-center flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-98 transition-all"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Navbar
