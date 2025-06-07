"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | undefined>(undefined)

interface DropdownMenuProps {
  children: React.ReactNode
}

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext)
    if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu")

    return (
      <button
        ref={ref}
        className={cn("inline-flex items-center justify-center", className)}
        onClick={() => context.setOpen(!context.open)}
        {...props}
      >
        {children}
      </button>
    )
  },
)
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext)
    if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu")

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref && "current" in ref && ref.current && !ref.current.contains(event.target as Node)) {
          context.setOpen(false)
        }
      }

      if (context.open) {
        document.addEventListener("mousedown", handleClickOutside)
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [context, ref])

    if (!context.open) return null

    return (
      <div
        ref={ref}
        className={cn(
          "absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
          className,
        )}
        {...props}
      >
        <div className="py-1">{children}</div>
      </div>
    )
  },
)
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext)

    return (
      <button
        ref={ref}
        className={cn(
          "block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted focus:bg-muted focus:outline-none",
          className,
        )}
        onClick={() => context?.setOpen(false)}
        {...props}
      >
        {children}
      </button>
    )
  },
)
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("my-1 h-px bg-border", className)} {...props} />
)
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator }
