"use client"

import type React from "react"

import { useState, useCallback } from "react"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min: number
  max: number
  step: number
  className?: string
}

export function Slider({ value, onValueChange, min, max, step, className = "" }: SliderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    updateValue(e)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e)
      }
    },
    [isDragging],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const updateValue = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const newValue = min + percentage * (max - min)
      const steppedValue = Math.round(newValue / step) * step
      onValueChange([Math.max(min, Math.min(max, steppedValue))])
    },
    [min, max, step, onValueChange],
  )

  const percentage = ((value[0] - min) / (max - min)) * 100

  return (
    <div
      className={`relative h-6 cursor-pointer ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={isDragging ? handleMouseMove : undefined}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-muted rounded-full">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${percentage}%` }} />
      </div>
      <div
        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background shadow-md"
        style={{ left: `${percentage}%` }}
      />
    </div>
  )
}
