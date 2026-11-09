import Image from "next/image"
import { StatCard } from "@/app/components/ui/Card"

// ไอคอนลูกบอล/ชนิดกีฬา (Sports)
const TrophySportsIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <path d="m4.93 4.93 4.24 4.24" />
        <path d="m14.83 9.17 4.24-4.24" />
        <path d="m14.83 14.83 4.24 4.24" />
        <path d="m9.17 14.83-4.24 4.24" />
        <circle cx="12" cy="12" r="4" />
    </svg>
)

// ไอคอนสนามกีฬา/สนามบนแพลตฟอร์ม (Stadium/Facility)
const StadiumIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 10a3 3 0 0 1 6 0v11" />
    </svg>
)

function Info() {
    return (
        <section id="info" className="relative w-full max-w-full min-h-screen xl:h-screen overflow-hidden select-none bg-white">
            {/* พื้นหลังแบ่งครึ่ง ซ้ายขาว - ขวาเหลือง */}
            <div className="absolute inset-0 flex flex-col lg:flex-row pointer-events-none">
                <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-white" />
                <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-brand-yellow" />
            </div>

            {/* ================= ของตกแต่งรอบนอก (Background Decorations) ================= */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                {/* --- ฝั่งซ้าย (ขาว) --- */}
                {/* ลายน้ำตัวหนังสือขนาดใหญ่ด้านหลัง (Watermark Background) */}
                <span className="hidden xl:block absolute -left-4 -bottom-10 text-[180px] 2xl:text-[220px] font-black text-neutral-100 leading-none select-none -z-10 tracking-tighter">
                    INFO
                </span>

                {/* จุด Dot Grid 4x3 ตกแต่งมุมซ้ายบน */}
                <div className="hidden xl:grid grid-cols-4 gap-3 absolute left-[7%] top-[12%] opacity-35">
                    {[...Array(12)].map((_, i) => (
                        <span key={i} className="w-1.5 h-1.5 bg-black rounded-full block" />
                    ))}
                </div>

                {/* เส้นคลื่นหยัก (Wave) ฝั่งซ้าย */}
                <svg
                    className="hidden xl:block absolute left-[8%] bottom-[24%] w-36 h-5 text-neutral-300"
                    viewBox="0 0 140 20"
                    fill="none"
                >
                    <path
                        d="M2 10 Q 11 2, 20 10 T 38 10 T 56 10 T 74 10 T 92 10 T 110 10 T 128 10"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </svg>

                <span className="hidden xl:block absolute left-[38%] top-[20%] text-black/50 font-black text-base">
                    ✕
                </span>

                {/* วงกลมเส้นบาง + จุดดำ มุมซ้ายล่าง */}
                <div className="hidden xl:flex absolute left-[7%] bottom-[10%] items-center">
                    <span className="w-7 h-7 rounded-full border-2 border-black/70 block" />
                    <span className="w-2 h-2 bg-black rounded-full -mt-6 ml-2 block" />
                </div>

                {/* --- ฝั่งขวา (เหลือง) --- */}
                {/* วงกลมเส้นบางขนาดใหญ่ ซ้อนอยู่หลังรูปภาพ */}
                <div className="hidden xl:block absolute right-[10%] top-[18%] w-64 h-64 2xl:w-80 2xl:h-80 rounded-full border-2 border-black/20" />

                {/* กากบาท 3 ตัวเรียงกัน ✕ ✕ ✕ ฝั่งขวา */}
                <div className="hidden xl:flex absolute right-[28%] top-[12%] items-center gap-3 text-black font-extrabold text-sm">
                    <span>✕</span>
                    <span>✕</span>
                    <span>✕</span>
                </div>

                {/* เส้นซิกแซกคู่ (ขาว + ดำ) ตกแต่งมุมขวาล่าง */}
                <div className="hidden xl:flex absolute right-[5%] bottom-[8%] flex-col gap-2">
                    <svg className="w-28 2xl:w-36 h-3.5 text-white" viewBox="0 0 140 16" fill="none">
                        <path
                            d="M2 14 L 14 2 L 26 14 L 38 2 L 50 14 L 62 2 L 74 14 L 86 2 L 98 14 L 110 2 L 122 14 L 134 2"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <svg className="w-28 2xl:w-36 h-3.5 text-black" viewBox="0 0 140 16" fill="none">
                        <path
                            d="M2 14 L 14 2 L 26 14 L 38 2 L 50 14 L 62 2 L 74 14 L 86 2 L 98 14 L 110 2 L 122 14 L 134 2"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            {/* ================= คอนเทนเนอร์หลัก (Main Container) ================= */}
            <div className="relative z-20 w-full max-w-[1520px] mx-auto min-h-screen xl:h-screen flex flex-col lg:flex-row">

                {/* ================= content ฝั่งซ้าย (พื้นหลังขาว) ================= */}
                <div className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-16 xl:px-20 py-10 lg:py-16">
                    {/* แถวบน: ขีดสีดำหนา + วันที่ */}
                    <div className="flex items-center justify-between w-full max-w-xl">
                        <span className="w-16 sm:w-20 xl:w-24 h-3 sm:h-3.5 bg-black block" />
                        <span className="font-primary font-bold text-base sm:text-lg xl:text-xl text-black tracking-wider">
                            29-10-2026
                        </span>
                    </div>
                    <div className="flex items-center gap-6 sm:gap-10 xl:gap-12 my-auto py-8">

                        <div className="relative flex items-center justify-center w-8">
                            <span className="font-primary font-black text-sm sm:text-base xl:text-lg text-black whitespace-nowrap -rotate-90 tracking-[0.22em] uppercase">
                                Eazy, first
                            </span>
                        </div>

                        {/* Title และคำอธิบาย */}
                        <div className="flex flex-col">
                            <h2 className="font-primary font-black text-black text-6xl sm:text-7xl md:text-8xl xl:text-[100px] 2xl:text-[110px] tracking-tight leading-[0.92] uppercase">
                                เกี่ยวกับเรา
                            </h2>
                            <p className="font-secondary text-black/75 text-lg sm:text-xl xl:text-2xl mt-4 sm:mt-6 font-medium max-w-md leading-relaxed">
                                แพลตฟอร์มบริหารจัดการสนามกีฬาครบวงจร รองรับทุกความต้องการทั้งผู้ดูแลสนามและผู้ใช้งานทั่วไป
                            </p>
                        </div>
                    </div>

                    {/* แถวล่าง: จุดระบุหน้า/หมวดหมู่ */}
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 bg-black block" />
                        <span className="font-primary font-semibold text-xs sm:text-sm text-black/70 tracking-widest uppercase">
                            SFM • Facility Info
                        </span>
                    </div>
                </div>

                {/* ================= content ฝั่งขวา (พื้นหลังเหลือง) ================= */}
                <div className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-14 xl:px-16 py-10 lg:py-16">
                    {/* ข้อความมุมขวาบน */}
                    <div className="flex flex-col items-end text-right self-end mt-1 lg:mt-4">
                        <p className="font-primary font-black text-black text-xl sm:text-2xl xl:text-[28px] tracking-wide leading-tight">
                            ลงทะเบียนเข้าใช้งานฟรี
                        </p>
                        <p className="font-secondary text-black/85 text-sm sm:text-base xl:text-lg font-medium mt-1">
                            เสถียรและใช้งานง่าย
                        </p>
                    </div>

                    {/* พื้นที่แสดงรูป device.gif ขยายขนาดใหญ่ พร้อมกรอบและเงาดีไซน์พรีเมียม */}
                    <div className="relative w-full max-w-[1000px] xl:max-w-[780px] 2xl:max-w-[840px] h-[300px] sm:h-[400px] md:h-[450px] xl:h-[480px] 2xl:h-[510px] mx-auto my-auto flex items-center justify-center">

                        {/* การ์ดมุมซ้ายบน: ประเภทกีฬา (ตามภาพ Reference) */}
                        <div className="absolute -top-4 -left-2 sm:-top-6 sm:-left-6 lg:-top-8 lg:-left-10 z-30 transform hover:-translate-y-1 transition-all duration-300">
                            <StatCard
                                variant="blue"
                                size="sm"
                                icon={<TrophySportsIcon />}
                                title="ประเภทกีฬา"
                                value="10+"
                                unit="ชนิดกีฬาที่รองรับ"
                                className="shadow-2xl shadow-blue-950/25"
                            />
                        </div>

                        <Image
                            src="/device.gif"
                            alt="ตัวอย่างการใช้งานบนอุปกรณ์ต่างๆ"
                            fill
                            unoptimized
                            className="object-contain"
                        />

                        {/* การ์ดมุมขวาล่าง: สนามบนแพลตฟอร์ม (ตามภาพ Reference) */}
                        <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 lg:-bottom-8 lg:-right-10 z-30 transform hover:-translate-y-1 transition-all duration-300">
                            <StatCard
                                variant="blue"
                                size="sm"
                                icon={<StadiumIcon />}
                                title="สนามบนแพลตฟอร์ม"
                                value="50+"
                                unit="สนาม"
                                className="shadow-2xl shadow-blue-950/25"
                            />
                        </div>

                    </div>

                    {/* ข้อความด้านล่างสุด ขยายใหญ่โดดเด่น */}
                    <div className="w-full text-center lg:text-left mt-4">
                        <h3 className="font-primary font-black text-black text-4xl sm:text-5xl md:text-6xl xl:text-[68px] 2xl:text-[76px] leading-none tracking-tight">
                            ใช้งานได้ทุกอุปกรณ์
                        </h3>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Info