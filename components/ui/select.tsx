"use client"

import type React from "react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
}

export function Select({ children, className = "", ...props }: SelectProps) {
  return (
    <select
      className={`
        w-full px-3 py-2 border border-border rounded-md
        bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  )
}
