"use client"

import Image from "next/image"
import Link from 'next/link'
import { MenuItem } from '@/app/types/MenuItem'
import { usePathname } from "next/navigation"
function Navbar() {

  const pathName = usePathname()

  const menulist: MenuItem[] = [
    {
      path: "/",
      name: "หน้าหลัก"
    }, {
      path: "/booking",
      name: "จองสนาม"
    },
    {
      path: "/reportproplem",
      name: "แจ้งปัญหา"
    }, {
      path: "/news",
      name: "ประชาสัมพันธ์"
    }
  ]
  return (
    <nav className="flex  justify-between bg-brand-blue  max-h-[120pw-screenx]  w-screen p-2 font-secondary">
      <Image
        src="/icon.svg"
        width={64}
        height={64}
        alt="icon navbar"
        loading="eager"
      />

      {/*  ๋์Navbar */}
      <ul className="flex items-center gap-4 px-4 bg-card rounded-full  text-brand-text ">
        {menulist.map((menu, index) => {
          const isActive = pathName === menu.path
          return (
            <li key={index} >
              <Link href={menu.path}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 block ${
                  isActive ? "bg-brand-blue txt-brand-text "
                  : "text-brand-text/70 hover:text-white"
                  }`}
              >
                {menu.name}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* ปุ่มสมัคร สมัครใช้งาน */}
      <ul className="flex items-center px-4 gap-4 ">
        <button className=" text-brand-text relative cursor-pointer py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100">
          สมัครใช้งาน
        </button>
        <button className="cursor-pointer rounded-full bg-white px-5 py-2 font-medium text-brand-blue shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 active:scale-95">
          เข้าสู่ระบบ
        </button>
      </ul>
    </nav>
  )
}

export default Navbar