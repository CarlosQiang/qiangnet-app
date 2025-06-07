"use client"

import { useState } from "react"
import { Button } from "./Button"
import { Input } from "./Input"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  className?: string
}

export function ColorPicker({ value, onChange, className = "" }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const presetColors = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#8b5cf6", // violet
    "#f59e0b", // amber
    "#ef4444", // red
    "#06b6d4", // cyan
    "#ec4899", // pink
    "#84cc16", // lime
    "#f97316", // orange
    "#6366f1", // indigo
  ]

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-12 h-10 p-0 border-2"
          style={{ backgroundColor: value }}
          onClick={() => setIsOpen(!isOpen)}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>

      {isOpen && (
        <div className="absolute top-12 left-0 z-50 p-3 bg-background border rounded-lg shadow-lg">
          <div className="grid grid-cols-5 gap-2 mb-3">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChange(color)
                  setIsOpen(false)
                }}
              />
            ))}
          </div>
          <Input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-10" />
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
