
import { ButtonProps } from "@/app/types/Button"
function Button({
    children,
    variant = "primary",
    size = "default",
    className = "",
    disabled,
    ...props
}: ButtonProps) {

    const baseStyles =
        "inline-flex items-center justify-center font-primary font-medium rounded-[10px] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

    // ขนาดของปุ่ม
    const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
        default: "w-[145px] h-[37px] text-sm",
        sm: "w-[110px] h-[32px] text-xs",
        lg: "w-[180px] h-[44px] text-base",
        auto: "px-4 py-2 text-sm w-auto h-auto",
        full: "w-full h-[37px] text-sm",
    };

    //  สไตล์ของปุ่ม
    const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
        // ปุ่มสีเหลืองแบรนด์ 
        primary: "bg-brand-yellow text-black hover:brightness-95 active:scale-[0.98]",
        // ปุ่มสีน้ำเงิน
        secondary: "bg-button-primary text-brand-text hover:brightness-110 active:scale-[0.98]",
        // สีทองโทน 
        gold: "bg-gold-400 text-black hover:bg-gold-500 active:scale-[0.98]",
        // เส้นขอบโปร่งใส
        outline: "bg-transparent text-black border border-current hover:bg-black/5 active:scale-[0.98]",
    };
    return (
        <button
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button


