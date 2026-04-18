import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[12px] border bg-[#faf9f5] px-4 py-2 text-sm text-[#141413] placeholder:text-[#87867f] focus-visible:outline-none focus-visible:border-[#3898ec] focus-visible:ring-2 focus-visible:ring-[#3898ec]/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        style={{ borderColor: "#e8e6dc" }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
