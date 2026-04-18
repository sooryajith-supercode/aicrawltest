import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        // Terracotta — primary CTA
        default: "rounded-[8px] px-4 py-2 text-[#faf9f5] shadow-[#c96442_0px_0px_0px_0px,#c96442_0px_0px_0px_1px] hover:opacity-90",
        // Warm Sand — secondary
        secondary: "rounded-[8px] px-4 py-2 bg-[#e8e6dc] text-[#4d4c48] shadow-[#e8e6dc_0px_0px_0px_0px,#d1cfc5_0px_0px_0px_1px] hover:bg-[#dddbd0]",
        // Dark Charcoal
        dark: "rounded-[8px] px-4 py-2 bg-[#30302e] text-[#faf9f5] shadow-[#30302e_0px_0px_0px_0px,#4d4c48_0px_0px_0px_1px] hover:bg-[#3d3d3a]",
        // Ghost
        ghost: "rounded-[8px] px-4 py-2 text-[#5e5d59] hover:bg-[#f0eee6] hover:text-[#141413]",
        // Link
        link: "text-[#c96442] underline-offset-4 hover:underline p-0 h-auto",
        outline: "rounded-[8px] px-4 py-2 border border-[#e8e6dc] bg-transparent text-[#4d4c48] hover:bg-[#f0eee6]",
      },
      size: {
        default: "h-10",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base rounded-[12px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  style?: React.CSSProperties
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const bgStyle =
      variant === "default" || variant === undefined
        ? { backgroundColor: "#c96442", ...style }
        : style
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={bgStyle}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
