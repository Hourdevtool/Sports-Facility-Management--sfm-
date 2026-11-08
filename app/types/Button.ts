export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  /** รูปแบบสีของปุ่ม */
  variant?: "primary" | "secondary" | "gold" | "outline";
  /** ขนาดของปุ่ม */
  size?: "default" | "sm" | "lg" | "full" | "auto";
  className?: string;
}

