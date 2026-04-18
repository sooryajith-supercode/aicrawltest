import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#c96442] text-[#faf9f5]",
        secondary: "bg-[#e8e6dc] text-[#4d4c48]",
        destructive: "bg-[#b53333]/10 text-[#b53333]",
        outline: "border border-[#e8e6dc] text-[#5e5d59]",
        success: "bg-[#3a7c52]/10 text-[#3a7c52]",
        warning: "bg-[#8a6a1a]/10 text-[#8a6a1a]",
        error: "bg-[#b53333]/10 text-[#b53333]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
