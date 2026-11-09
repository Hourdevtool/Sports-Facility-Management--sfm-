import React from "react";
import {
  CardProps,
  StatCardProps,
  CardVariant,
  CardSize,
  CardFont,
} from "@/app/types/Card";

// สไตล์พื้นฐานของการ์ด
const baseCardStyles =
  "relative flex flex-col justify-between transition-all duration-200 select-none";

// ขนาดและระยะขอบของการ์ด
const sizeStyles: Record<CardSize, string> = {
  sm: "p-4 min-w-[170px] rounded-[18px]",
  default: "p-5 sm:p-6 min-w-[210px] sm:min-w-[240px] rounded-[22px]",
  lg: "p-6 sm:p-8 min-w-[260px] sm:min-w-[300px] rounded-[26px]",
  full: "p-5 sm:p-6 w-full rounded-[22px]",
  auto: "p-4 sm:p-5 w-auto rounded-[20px]",
};

// ธีมสี (Variants) อ้างอิง Design System
const variantStyles: Record<CardVariant, string> = {
  // สไตล์สีขาวคลีน ขอบมน เงาบาง ตามภาพอ้างอิง
  default:
    "bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.05)] text-slate-800",
  // สีน้ำเงินระบบ (#262873)
  primary:
    "bg-card text-brand-text shadow-xl shadow-card/20 border border-white/10",
  // สีน้ำเงินแบรนด์สดใส (#2563EB)
  blue:
    "bg-brand-blue text-white shadow-xl shadow-brand-blue/25 border border-white/20",
  // สีเหลืองแบรนด์ (#FDD60A)
  yellow:
    "bg-brand-yellow text-black shadow-lg shadow-brand-yellow/20 border border-black/10",
  // สีทองโทน
  gold:
    "bg-gold-50 border border-gold-300 text-gold-900 shadow-md shadow-gold-900/5",
  // เส้นขอบโปร่งใส
  outline:
    "bg-transparent border-2 border-slate-200 text-slate-800 hover:border-slate-300 backdrop-blur-sm",
};

// สไตล์ฟอนต์
const fontStyles: Record<CardFont, string> = {
  primary: "font-primary",
  secondary: "font-secondary",
};

// สี Default ของไอคอนตามธีม
const defaultIconColors: Record<CardVariant, string> = {
  default: "text-brand-blue",
  primary: "text-brand-yellow",
  blue: "text-white",
  yellow: "text-black",
  gold: "text-gold-600",
  outline: "text-slate-700",
};

// สีข้อความหัวข้อตามธีม
const defaultTitleColors: Record<CardVariant, string> = {
  default: "text-slate-500",
  primary: "text-white/80",
  blue: "text-white/90",
  yellow: "text-black/80",
  gold: "text-gold-800/80",
  outline: "text-slate-600",
};

// สีตัวเลขหลักตามธีม
const defaultValueColors: Record<CardVariant, string> = {
  default: "text-slate-900",
  primary: "text-white",
  blue: "text-white",
  yellow: "text-black",
  gold: "text-gold-900",
  outline: "text-slate-900",
};

// สีหน่วยนับตามธีม
const defaultUnitColors: Record<CardVariant, string> = {
  default: "text-slate-400",
  primary: "text-white/60",
  blue: "text-white/80",
  yellow: "text-black/60",
  gold: "text-gold-700/70",
  outline: "text-slate-400",
};

// ขนาดตัวเลขสถิติตามไซส์
const valueSizeStyles: Record<CardSize, string> = {
  sm: "text-2xl sm:text-3xl",
  default: "text-3xl sm:text-4xl",
  lg: "text-4xl sm:text-5xl",
  full: "text-3xl sm:text-4xl",
  auto: "text-2xl sm:text-3xl",
};

/**
 * Card Component พื้นฐาน
 */
export function Card({
  children,
  variant = "default",
  size = "default",
  fontFamily = "primary",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`${baseCardStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fontStyles[fontFamily]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * StatCard สำหรับแสดงข้อมูลสถิติ/ตัวเลข ตามแบบในภาพ
 */
export function StatCard({
  icon,
  iconClassName = "",
  title,
  titleClassName = "",
  value,
  valueClassName = "",
  unit,
  unitClassName = "",
  variant = "default",
  size = "default",
  fontFamily = "primary",
  extra,
  children,
  className = "",
  ...props
}: StatCardProps) {
  const iconColor = iconClassName || defaultIconColors[variant];
  const titleColor = titleClassName || defaultTitleColors[variant];
  const valueColor = valueClassName || defaultValueColors[variant];
  const unitColor = unitClassName || defaultUnitColors[variant];

  return (
    <Card
      variant={variant}
      size={size}
      fontFamily={fontFamily}
      className={`gap-3 ${className}`}
      {...props}
    >
      {/* ส่วนบน: ไอคอน + ชื่อหัวข้อ */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {icon && (
            <span className={`inline-flex shrink-0 text-xl ${iconColor}`}>
              {icon}
            </span>
          )}
          <span
            className={`font-secondary font-medium text-sm sm:text-base tracking-normal ${titleColor}`}
          >
            {title}
          </span>
        </div>
        {extra && <div className="shrink-0">{extra}</div>}
      </div>

      {/* ส่วนกลาง: ค่าตัวเลขหรือสถิติหลัก */}
      {value !== undefined && (
        <div className="my-0.5">
          <span
            className={`font-primary font-bold ${valueSizeStyles[size]} leading-tight tracking-tight block ${valueColor}`}
          >
            {value}
          </span>
        </div>
      )}

      {/* ส่วนล่าง: หน่วยนับ */}
      {unit && (
        <div>
          <span
            className={`font-secondary font-normal text-xs sm:text-sm ${unitColor}`}
          >
            {unit}
          </span>
        </div>
      )}

      {children}
    </Card>
  );
}

export default Card;
