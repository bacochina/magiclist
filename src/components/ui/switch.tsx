"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, disabled = false, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked)
      }
    }

    return (
      <div
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        data-state={checked ? "checked" : "unchecked"}
        onClick={handleClick}
        ref={ref}
        className={cn(
          "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-purple-600" : "bg-slate-600",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </div>
    )
  }
)

Switch.displayName = "Switch"

export { Switch } 