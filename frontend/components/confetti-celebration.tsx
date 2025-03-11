"use client"

import { useState, useEffect } from "react"
import Confetti from "react-confetti"

export function ConfettiCelebration() {
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 })
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    setWindowDimension({ width: window.innerWidth, height: window.innerHeight })
    const timeout = setTimeout(() => setShowConfetti(false), 5000) // Stop after 5 seconds
    return () => clearTimeout(timeout)
  }, [])

  return (
    <>{showConfetti && <Confetti width={windowDimension.width} height={windowDimension.height} recycle={false} />}</>
  )
}

