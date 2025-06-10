"use client"

import { useEffect, useRef, useState } from "react"
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Share2,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface InteractiveSimulationProps {
  demoId: string
  title: string
  videoUrl?: string
}

export function InteractiveSimulation({ demoId, title, videoUrl }: InteractiveSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const animationRef = useRef<number>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState([1])
  const [amplitude, setAmplitude] = useState([50])
  const [showVideo, setShowVideo] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState("simulation")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size with device pixel ratio for crisp rendering
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = rect.width + "px"
    canvas.style.height = rect.height + "px"

    // Initialize simulation based on demo type
    if (demoId.includes("pendulum") || demoId.includes("phy-001")) {
      initPendulumSimulation(ctx, canvas)
    } else if (demoId.includes("wave") || demoId.includes("phy-003")) {
      initWaveSimulation(ctx, canvas)
    } else if (demoId.includes("circuit") || demoId.includes("phy-002")) {
      initCircuitSimulation(ctx, canvas)
    } else if (demoId.includes("electromagnetic") || demoId.includes("phy-006")) {
      initElectromagneticSimulation(ctx, canvas)
    } else if (demoId.includes("quantum") || demoId.includes("phy-007")) {
      initQuantumSimulation(ctx, canvas)
    } else if (demoId.includes("dna") || demoId.includes("bio-006")) {
      initDNASimulation(ctx, canvas)
    } else if (demoId.includes("derivative") || demoId.includes("math-006")) {
      initDerivativeSimulation(ctx, canvas)
    } else {
      initGenericSimulation(ctx, canvas, title)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [demoId, title])

  const initPendulumSimulation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    let angle = Math.PI / 4
    let angleVel = 0
    const length = 150
    const gravity = 0.5

    const animate = () => {
      if (!isPlaying) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Enhanced background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#87ceeb")
      gradient.addColorStop(1, "#e0f6ff")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw ceiling with better styling
      ctx.strokeStyle = "#8B4513"
      ctx.lineWidth = 6
      ctx.lineCap = "round"
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2 - 60, 20)
      ctx.lineTo(canvas.width / 2 + 60, 20)
      ctx.stroke()

      // Add ceiling mount
      ctx.fillStyle = "#654321"
      ctx.fillRect(canvas.width / 2 - 10, 15, 20, 10)

      // Calculate pendulum position
      const x = canvas.width / 2 + length * Math.sin(angle)
      const y = 40 + length * Math.cos(angle)

      // Draw string with shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = 2
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1
      ctx.strokeStyle = "#654321"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, 20)
      ctx.lineTo(x, y)
      ctx.stroke()

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      // Draw bob with gradient and shadow
      const bobGradient = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, 15)
      bobGradient.addColorStop(0, "#FFD700")
      bobGradient.addColorStop(1, "#FFA500")
      ctx.fillStyle = bobGradient
      ctx.beginPath()
      ctx.arc(x, y, 15, 0, 2 * Math.PI)
      ctx.fill()

      // Bob outline
      ctx.strokeStyle = "#FF8C00"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw motion trail
      ctx.globalAlpha = 0.3
      ctx.strokeStyle = "#FFD700"
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = -Math.PI / 3; i <= Math.PI / 3; i += 0.1) {
        const trailX = canvas.width / 2 + length * Math.sin(i)
        const trailY = 40 + length * Math.cos(i)
        if (i === -Math.PI / 3) {
          ctx.moveTo(trailX, trailY)
        } else {
          ctx.lineTo(trailX, trailY)
        }
      }
      ctx.stroke()
      ctx.globalAlpha = 1

      // Draw ground shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
      ctx.beginPath()
      ctx.ellipse(x, canvas.height - 10, 20, 5, 0, 0, 2 * Math.PI)
      ctx.fill()

      // Physics calculation with enhanced damping
      const angleAcc = (-gravity / length) * Math.sin(angle) * speed[0]
      angleVel += angleAcc
      angleVel *= 0.998 // Realistic damping
      angle += angleVel

      animationRef.current = requestAnimationFrame(animate)
    }

    if (isPlaying) {
      animate()
    }
  }

  const initWaveSimulation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    let time = 0

    const animate = () => {
      if (!isPlaying) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Enhanced background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#001122")
      gradient.addColorStop(1, "#003366")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw wave with glow effect
      ctx.shadowColor = "#00FFFF"
      ctx.shadowBlur = 10
      ctx.strokeStyle = "#00FFFF"
      ctx.lineWidth = 4
      ctx.beginPath()

      for (let x = 0; x < canvas.width; x += 2) {
        const y = canvas.height / 2 + amplitude[0] * Math.sin(x * 0.02 + time * speed[0] * 0.1)
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      // Draw amplitude indicators with labels
      ctx.strokeStyle = "#FF6B6B"
      ctx.setLineDash([5, 5])
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2 - amplitude[0])
      ctx.lineTo(canvas.width, canvas.height / 2 - amplitude[0])
      ctx.moveTo(0, canvas.height / 2 + amplitude[0])
      ctx.lineTo(canvas.width, canvas.height / 2 + amplitude[0])
      ctx.stroke()
      ctx.setLineDash([])

      // Add amplitude labels
      ctx.fillStyle = "#FF6B6B"
      ctx.font = "12px Arial"
      ctx.fillText(`+A = ${amplitude[0]}`, 10, canvas.height / 2 - amplitude[0] - 5)
      ctx.fillText(`-A = ${amplitude[0]}`, 10, canvas.height / 2 + amplitude[0] + 15)

      // Draw center line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
      ctx.setLineDash([2, 2])
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Add wavelength indicator
      const wavelength = (2 * Math.PI) / 0.02
      ctx.strokeStyle = "#FFFF00"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(50, canvas.height - 30)
      ctx.lineTo(50 + wavelength, canvas.height - 30)
      ctx.stroke()

      // Wavelength arrows
      ctx.beginPath()
      ctx.moveTo(50, canvas.height - 30)
      ctx.lineTo(55, canvas.height - 35)
      ctx.moveTo(50, canvas.height - 30)
      ctx.lineTo(55, canvas.height - 25)
      ctx.moveTo(50 + wavelength, canvas.height - 30)
      ctx.lineTo(45 + wavelength, canvas.height - 35)
      ctx.moveTo(50 + wavelength, canvas.height - 30)
      ctx.lineTo(45 + wavelength, canvas.height - 25)
      ctx.stroke()

      ctx.fillStyle = "#FFFF00"
      ctx.fillText("λ (wavelength)", 50 + wavelength / 2 - 30, canvas.height - 10)

      time += 1
      animationRef.current = requestAnimationFrame(animate)
    }

    if (isPlaying) {
      animate()
    }
  }

  const initCircuitSimulation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    let currentFlow = 0

    const animate = () => {
      if (!isPlaying) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Enhanced background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#f8f9fa")
      gradient.addColorStop(1, "#e9ecef")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw circuit board background
      ctx.fillStyle = "#2d5016"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw circuit traces
      ctx.strokeStyle = "#FFD700"
      ctx.lineWidth = 6
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      // Main circuit path
      ctx.beginPath()
      // Top wire
      ctx.moveTo(centerX - 80, centerY - 20)
      ctx.lineTo(centerX + 80, centerY - 20)
      // Right wire
      ctx.lineTo(centerX + 80, centerY + 20)
      // Bottom wire
      ctx.lineTo(centerX - 80, centerY + 20)
      // Left wire
      ctx.lineTo(centerX - 80, centerY - 20)
      ctx.stroke()

      // Draw battery with enhanced styling
      const batteryGradient = ctx.createLinearGradient(centerX - 80, centerY - 15, centerX - 40, centerY + 15)
      batteryGradient.addColorStop(0, "#FF6B6B")
      batteryGradient.addColorStop(1, "#FF4444")
      ctx.fillStyle = batteryGradient
      ctx.fillRect(centerX - 80, centerY - 15, 40, 30)

      // Battery terminals
      ctx.fillStyle = "#333"
      ctx.fillRect(centerX - 85, centerY - 5, 5, 10)
      ctx.fillRect(centerX - 40, centerY - 8, 5, 16)

      // Battery labels
      ctx.fillStyle = "#FFF"
      ctx.font = "bold 16px Arial"
      ctx.textAlign = "center"
      ctx.fillText("+", centerX - 45, centerY + 5)
      ctx.fillText("-", centerX - 75, centerY + 5)

      ctx.fillStyle = "#000"
      ctx.font = "12px Arial"
      ctx.fillText("9V Battery", centerX - 60, centerY + 40)

      // Draw resistor with color bands
      const resistorGradient = ctx.createLinearGradient(centerX + 40, centerY - 10, centerX + 80, centerY + 10)
      resistorGradient.addColorStop(0, "#D2B48C")
      resistorGradient.addColorStop(1, "#8B7355")
      ctx.fillStyle = resistorGradient
      ctx.fillRect(centerX + 40, centerY - 10, 40, 20)

      // Resistor color bands
      const bands = ["#8B4513", "#FF0000", "#FFA500", "#FFD700"]
      bands.forEach((color, i) => {
        ctx.fillStyle = color
        ctx.fillRect(centerX + 45 + i * 7, centerY - 10, 3, 20)
      })

      ctx.fillStyle = "#000"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("1kΩ Resistor", centerX + 60, centerY + 40)

      // Draw LED
      ctx.fillStyle = "#FF0000"
      ctx.beginPath()
      ctx.arc(centerX, centerY - 40, 8, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
      ctx.stroke()

      // LED light rays when current flows
      if (Math.sin(currentFlow * 0.5) > 0) {
        ctx.strokeStyle = "#FFFF00"
        ctx.lineWidth = 2
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * 2 * Math.PI
          ctx.beginPath()
          ctx.moveTo(centerX + 12 * Math.cos(angle), centerY - 40 + 12 * Math.sin(angle))
          ctx.lineTo(centerX + 20 * Math.cos(angle), centerY - 40 + 20 * Math.sin(angle))
          ctx.stroke()
        }
      }

      // Animate current flow with enhanced electrons
      const flowPositions = [
        { x: centerX - 60, y: centerY - 20 },
        { x: centerX - 20, y: centerY - 20 },
        { x: centerX + 20, y: centerY - 20 },
        { x: centerX + 60, y: centerY - 20 },
        { x: centerX + 80, y: centerY },
        { x: centerX + 60, y: centerY + 20 },
        { x: centerX + 20, y: centerY + 20 },
        { x: centerX - 20, y: centerY + 20 },
        { x: centerX - 60, y: centerY + 20 },
        { x: centerX - 80, y: centerY },
      ]

      // Draw multiple electrons
      for (let i = 0; i < 5; i++) {
        const pos = flowPositions[(Math.floor(currentFlow * speed[0]) + i * 2) % flowPositions.length]

        // Electron glow
        ctx.shadowColor = "#00FFFF"
        ctx.shadowBlur = 8
        ctx.fillStyle = "#00FFFF"
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 4, 0, 2 * Math.PI)
        ctx.fill()

        // Electron core
        ctx.shadowBlur = 0
        ctx.fillStyle = "#0088FF"
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 2, 0, 2 * Math.PI)
        ctx.fill()
      }

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      // Add current direction arrow
      ctx.strokeStyle = "#FF00FF"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centerX - 100, centerY - 50)
      ctx.lineTo(centerX - 80, centerY - 50)
      ctx.lineTo(centerX - 85, centerY - 55)
      ctx.moveTo(centerX - 80, centerY - 50)
      ctx.lineTo(centerX - 85, centerY - 45)
      ctx.stroke()

      ctx.fillStyle = "#FF00FF"
      ctx.font = "12px Arial"
      ctx.fillText("Current Flow", centerX - 120, centerY - 60)

      currentFlow += 0.1
      animationRef.current = requestAnimationFrame(animate)
    }

    if (isPlaying) {
      animate()
    }
  }

  const initElectromagneticSimulation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    let time = 0

    const animate = () => {
      if (!isPlaying) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Enhanced background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
      )
      gradient.addColorStop(0, "#1a1a2e")
      gradient.addColorStop(1, "#16213e")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw magnet with 3D effect
      const magnetGradient1 = ctx.createLinearGradient(centerX - 60, centerY - 20, centerX - 10, centerY + 20)
      magnetGradient1.addColorStop(0, "#FF6666")
      magnetGradient1.addColorStop(1, "#CC0000")
      ctx.fillStyle = magnetGradient1
      ctx.fillRect(centerX - 60, centerY - 20, 50, 40)

      const magnetGradient2 = ctx.createLinearGradient(centerX + 10, centerY - 20, centerX + 60, centerY + 20)
      magnetGradient2.addColorStop(0, "#6666FF")
      magnetGradient2.addColorStop(1, "#0000CC")
      ctx.fillStyle = magnetGradient2
      ctx.fillRect(centerX + 10, centerY - 20, 50, 40)

      // Magnet labels with better styling
      ctx.fillStyle = "#FFF"
      ctx.font = "bold 20px Arial"
      ctx.textAlign = "center"
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
      ctx.strokeText("N", centerX - 35, centerY + 8)
      ctx.fillText("N", centerX - 35, centerY + 8)
      ctx.strokeText("S", centerX + 35, centerY + 8)
      ctx.fillText("S", centerX + 35, centerY + 8)

      // Draw coil with 3D perspective
      ctx.strokeStyle = "#CD7F32"
      ctx.lineWidth = 4
      for (let i = 0; i < 6; i++) {
        const x = centerX + 80 + i * 12
        const scaleY = 0.7 + 0.3 * Math.sin(i * 0.5)

        ctx.beginPath()
        ctx.ellipse(x, centerY, 15, 15 * scaleY, 0, 0, 2 * Math.PI)
        ctx.stroke()

        // Coil highlights
        ctx.strokeStyle = "#FFD700"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(x, centerY - 5, 15, 15 * scaleY, 0, Math.PI * 1.2, Math.PI * 1.8)
        ctx.stroke()
        ctx.strokeStyle = "#CD7F32"
        ctx.lineWidth = 4
      }

      // Draw enhanced magnetic field lines
      ctx.strokeStyle = "#00FF88"
      ctx.lineWidth = 2
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * 2 * Math.PI
        const startRadius = 35
        const endRadius = 80

        // Create curved field lines
        ctx.beginPath()
        for (let r = startRadius; r <= endRadius; r += 2) {
          const fieldStrength = 1 - (r - startRadius) / (endRadius - startRadius)
          const wobble = 5 * fieldStrength * Math.sin(time * 0.1 + r * 0.1)
          const x = centerX + (r + wobble) * Math.cos(angle)
          const y = centerY + (r + wobble) * Math.sin(angle) * 0.8

          if (r === startRadius) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()

        // Field direction arrows
        const arrowR = startRadius + 30
        const arrowX = centerX + arrowR * Math.cos(angle)
        const arrowY = centerY + arrowR * Math.sin(angle) * 0.8
        const arrowAngle = angle + Math.PI * 0.1

        ctx.beginPath()
        ctx.moveTo(arrowX, arrowY)
        ctx.lineTo(arrowX - 8 * Math.cos(arrowAngle - 0.3), arrowY - 8 * Math.sin(arrowAngle - 0.3))
        ctx.moveTo(arrowX, arrowY)
        ctx.lineTo(arrowX - 8 * Math.cos(arrowAngle + 0.3), arrowY - 8 * Math.sin(arrowAngle + 0.3))
        ctx.stroke()
      }

      // Animate induced current with enhanced visualization
      const inducedCurrent = Math.sin(time * speed[0] * 0.1)
      if (inducedCurrent > 0) {
        // Current flowing one direction
        ctx.strokeStyle = "#FFD700"
        ctx.lineWidth = 6
        ctx.shadowColor = "#FFD700"
        ctx.shadowBlur = 10

        ctx.beginPath()
        ctx.moveTo(centerX + 80, centerY - 25)
        ctx.lineTo(centerX + 150, centerY - 25)
        ctx.lineTo(centerX + 150, centerY + 25)
        ctx.lineTo(centerX + 80, centerY + 25)
        ctx.stroke()

        // Current direction indicators
        for (let i = 0; i < 3; i++) {
          const arrowX = centerX + 100 + i * 20
          ctx.beginPath()
          ctx.moveTo(arrowX, centerY - 15)
          ctx.lineTo(arrowX + 8, centerY - 15)
          ctx.lineTo(arrowX + 5, centerY - 18)
          ctx.moveTo(arrowX + 8, centerY - 15)
          ctx.lineTo(arrowX + 5, centerY - 12)
          ctx.stroke()
        }
      } else if (inducedCurrent < -0.3) {
        // Current flowing opposite direction
        ctx.strokeStyle = "#FF6B6B"
        ctx.lineWidth = 6
        ctx.shadowColor = "#FF6B6B"
        ctx.shadowBlur = 10

        ctx.beginPath()
        ctx.moveTo(centerX + 80, centerY - 25)
        ctx.lineTo(centerX + 150, centerY - 25)
        ctx.lineTo(centerX + 150, centerY + 25)
        ctx.lineTo(centerX + 80, centerY + 25)
        ctx.stroke()

        // Opposite current direction indicators
        for (let i = 0; i < 3; i++) {
          const arrowX = centerX + 130 - i * 20
          ctx.beginPath()
          ctx.moveTo(arrowX, centerY + 15)
          ctx.lineTo(arrowX - 8, centerY + 15)
          ctx.lineTo(arrowX - 5, centerY + 18)
          ctx.moveTo(arrowX - 8, centerY + 15)
          ctx.lineTo(arrowX - 5, centerY + 12)
          ctx.stroke()
        }
      }

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      // Add EMF meter
      ctx.fillStyle = "#333"
      ctx.fillRect(centerX + 160, centerY - 30, 60, 60)
      ctx.strokeStyle = "#FFF"
      ctx.lineWidth = 2
      ctx.strokeRect(centerX + 160, centerY - 30, 60, 60)

      ctx.fillStyle = "#00FF00"
      ctx.font = "12px monospace"
      ctx.textAlign = "center"
      ctx.fillText("EMF", centerX + 190, centerY - 15)
      ctx.fillText(`${(inducedCurrent * 5).toFixed(1)}V`, centerX + 190, centerY + 5)

      // EMF meter needle
      const needleAngle = inducedCurrent * Math.PI * 0.4
      ctx.strokeStyle = "#FF0000"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centerX + 190, centerY + 10)
      ctx.lineTo(
        centerX + 190 + 15 * Math.cos(needleAngle - Math.PI / 2),
        centerY + 10 + 15 * Math.sin(needleAngle - Math.PI / 2),
      )
      ctx.stroke()

      time += 1
      animationRef.current = requestAnimationFrame(animate)
    }

    if (isPlaying) {
      animate()
    }
  }

  const initQuantumSimulation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    let time = 0

    const animate = () => {
      if (!isPlaying) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Quantum field background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
      )
      gradient.addColorStop(0, "#0a0a0a")
      gradient.addColorStop(0.5, "#1a0a2e")
      gradient.addColorStop(1, "#0a0a0a")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw quantum wave function with interference patterns
      ctx.strokeStyle = "#FF6B6B"
      ctx.lineWidth = 3
      ctx.shadowColor = "#FF6B6B"
      ctx.shadowBlur = 5

      ctx.beginPath()
      for (let x = 0; x < canvas.width; x += 2) {
        const normalizedX = (x - centerX) / 100
        const waveFunction =
          Math.exp((-normalizedX * normalizedX) / 2) *
          Math.sin(normalizedX * 3 + time * speed[0] * 0.1) *
          amplitude[0] *
          0.5
        const y = centerY + waveFunction

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Draw probability density (|ψ|²)
      ctx.fillStyle = "rgba(0, 255, 255, 0.3)"
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      for (let x = 0; x < canvas.width; x += 2) {
        const normalizedX = (x - centerX) / 100
        const waveFunction =
          Math.exp((-normalizedX * normalizedX) / 2) *
          Math.sin(normalizedX * 3 + time * speed[0] * 0.1) *
          amplitude[0] *
          0.5
        const probability = Math.abs(waveFunction) * 2
        const y = centerY - probability
        ctx.lineTo(x, y)
      }
      ctx.lineTo(canvas.width, centerY)
      ctx.closePath()
      ctx.fill()

      // Draw particle with uncertainty
      const particleX = centerX + 60 * Math.sin(time * speed[0] * 0.05)
      const uncertainty = 20 * Math.exp(-Math.pow(particleX - centerX, 2) / 5000)

      // Uncertainty cloud
      ctx.fillStyle = "rgba(255, 215, 0, 0.2)"
      ctx.beginPath()
      ctx.ellipse(particleX, centerY, uncertainty, uncertainty * 0.5, 0, 0, 2 * Math.PI)
      ctx.fill()

      // Particle
      ctx.shadowColor = "#FFD700"
      ctx.shadowBlur = 10
      ctx.fillStyle = "#FFD700"
      ctx.beginPath()
      ctx.arc(particleX, centerY, 5, 0, 2 * Math.PI)
      ctx.fill()

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      // Draw energy levels
      const energyLevels = [0.8, 0.6, 0.4, 0.2]
      energyLevels.forEach((level, i) => {
        const y = centerY + 80 - level * 100
        ctx.strokeStyle = `hsl(${240 + i * 30}, 70%, 60%)`
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(50, y)
        ctx.lineTo(150, y)
        ctx.stroke()

        ctx.fillStyle = ctx.strokeStyle
        ctx.font = "12px Arial"
        ctx.fillText(`E${i + 1}`, 20, y + 5)
      })
      ctx.setLineDash([])

      // Quantum tunneling visualization
      if (Math.sin(time * 0.1) > 0.5) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
        ctx.fillRect(centerX + 80, centerY - 50, 20, 100)

        ctx.fillStyle = "#FFF"
        ctx.font = "12px Arial"
        ctx.fillText("Barrier", centerX + 75, centerY + 70)
      }

      // Add quantum labels
      ctx.fillStyle = "#FFF"
      ctx.font = "14px Arial"
      ctx.fillText("Wave Function ψ(x)", 10, 30)
      ctx.fillStyle = "rgba(0, 255, 255, 0.8)"
      ctx.fillText("Probability Density |ψ|²", 10, 50)

      time += 1
      animationRef.current = requestAnimationFrame(animate)
    }

    if (isPlaying) {
      animate()
    }
  }

  const initDNASimulation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    let time = 0

    const animate = () => {
      if (!isPlaying) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Cellular background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#f0f8ff")
      gradient.addColorStop(1, "#e6f3ff")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const helixHeight = canvas.height - 60

      // Draw DNA double helix with enhanced 3D effect
      const basePairs = ["A-T", "G-C", "T-A", "C-G"]

      for (let i = 0; i < helixHeight; i += 8) {
        const t = (i * 0.1 + time * speed[0] * 0.02) % (2 * Math.PI)
        const angle1 = t
        const angle2 = t + Math.PI

        const radius = 35
        const x1 = centerX + radius * Math.cos(angle1)
        const y1 = 30 + i
        const x2 = centerX + radius * Math.cos(angle2)
        const y2 = 30 + i

        // Draw backbone with gradient
        const backboneGradient1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, 8)
        backboneGradient1.addColorStop(0, "#4ECDC4")
        backboneGradient1.addColorStop(1, "#2E8B8B")
        ctx.fillStyle = backboneGradient1
        ctx.beginPath()
        ctx.arc(x1, y1, 4, 0, 2 * Math.PI)
        ctx.fill()

        const backboneGradient2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, 8)
        backboneGradient2.addColorStop(0, "#FF6B6B")
        backboneGradient2.addColorStop(1, "#CC5555")
        ctx.fillStyle = backboneGradient2
        ctx.beginPath()
        ctx.arc(x2, y2, 4, 0, 2 * Math.PI)
        ctx.fill()

        // Connect backbones with phosphate bonds
        if (i > 0) {
          const prevAngle1 = t - 0.08
          const prevAngle2 = t + Math.PI - 0.08
          const prevX1 = centerX + radius * Math.cos(prevAngle1)
          const prevY1 = 30 + i - 8
          const prevX2 = centerX + radius * Math.cos(prevAngle2)
          const prevY2 = 30 + i - 8

          ctx.strokeStyle = "#4ECDC4"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(prevX1, prevY1)
          ctx.lineTo(x1, y1)
          ctx.stroke()

          ctx.strokeStyle = "#FF6B6B"
          ctx.beginPath()
          ctx.moveTo(prevX2, prevY2)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }

        // Draw base pairs every 4th iteration
        if (i % 32 === 0) {
          ctx.strokeStyle = "#666"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()

          // Draw bases
          const basePair = basePairs[Math.floor(i / 32) % basePairs.length]
          const [base1, base2] = basePair.split("-")

          // Base colors
          const baseColors = {
            A: "#FF6B6B",
            T: "#4ECDC4",
            G: "#45B7D1",
            C: "#96CEB4",
          }

          const midX = (x1 + x2) / 2
          const midY = (y1 + y2) / 2

          // Base 1
          ctx.fillStyle = baseColors[base1 as keyof typeof baseColors]
          ctx.beginPath()
          ctx.arc(x1 + (midX - x1) * 0.3, y1 + (midY - y1) * 0.3, 6, 0, 2 * Math.PI)
          ctx.fill()

          // Base 2
          ctx.fillStyle = baseColors[base2 as keyof typeof baseColors]
          ctx.beginPath()
          ctx.arc(x2 + (midX - x2) * 0.3, y2 + (midY - y2) * 0.3, 6, 0, 2 * Math.PI)
          ctx.fill()

          // Hydrogen bonds
          ctx.strokeStyle = "rgba(255, 255, 0, 0.6)"
          ctx.lineWidth = 2
          ctx.setLineDash([3, 3])
          const bondCount = base1 === "A" || base1 === "T" ? 2 : 3
          for (let b = 0; b < bondCount; b++) {
            const offset = (b - (bondCount - 1) / 2) * 4
            ctx.beginPath()
            ctx.moveTo(x1 + (midX - x1) * 0.5, y1 + (midY - y1) * 0.5 + offset)
            ctx.lineTo(x2 + (midX - x2) * 0.5, y2 + (midY - y2) * 0.5 + offset)
            ctx.stroke()
          }
          ctx.setLineDash([])

          // Base pair labels
          ctx.fillStyle = "#333"
          ctx.font = "bold 12px Arial"
          ctx.textAlign = "center"
          ctx.fillText(base1, x1 + (midX - x1) * 0.3, y1 + (midY - y1) * 0.3 + 4)
          ctx.fillText(base2, x2 + (midX - x2) * 0.3, y2 + (midY - y2) * 0.3 + 4)
        }
      }

      // Add major and minor groove indicators
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
      ctx.lineWidth = 1
      ctx.setLineDash([2, 2])

      // Major groove
      ctx.beginPath()
      ctx.moveTo(centerX - 50, 30)
      ctx.lineTo(centerX - 50, canvas.height - 30)
      ctx.stroke()

      // Minor groove
      ctx.beginPath()
      ctx.moveTo(centerX + 50, 30)
      ctx.lineTo(centerX + 50, canvas.height - 30)
      ctx.stroke()
      ctx.setLineDash([])

      // Labels
      ctx.fillStyle = "#666"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Major Groove", centerX - 70, 50)
      ctx.fillText("Minor Groove", centerX + 70, 50)

      // DNA direction arrows
      ctx.strokeStyle = "#333"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX - 80, 60)
      ctx.lineTo(centerX - 80, 40)
      ctx.lineTo(centerX - 85, 45)
      ctx.moveTo(centerX - 80, 40)
      ctx.lineTo(centerX - 75, 45)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(centerX + 80, canvas.height - 60)
      ctx.lineTo(centerX + 80, canvas.height - 40)
      ctx.lineTo(centerX + 85, canvas.height - 45)
      ctx.moveTo(centerX + 80, canvas.height - 40)
      ctx.lineTo(centerX + 75, canvas.height - 45)
      ctx.stroke()

      ctx.fillStyle = "#333"
      ctx.font = "10px Arial"
      ctx.fillText("5'", centerX - 80, 35)
      ctx.fillText("3'", centerX - 80, canvas.height - 25)
      ctx.fillText("3'", centerX + 80, 35)
      ctx.fillText("5'", centerX + 80, canvas.height - 25)

      time += 1
      animationRef.current = requestAnimationFrame(animate)
    }

    if (isPlaying) {
      animate()
    }
  }

  const initDerivativeSimulation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    let time = 0

    const animate = () => {
      if (!isPlaying) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Mathematical background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#f8f9fa")
      gradient.addColorStop(1, "#e9ecef")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const scale = 50

      // Draw coordinate system with grid
      ctx.strokeStyle = "#e0e0e0"
      ctx.lineWidth = 1

      // Grid lines
      for (let x = 0; x <= canvas.width; x += scale) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y <= canvas.height; y += scale) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Main axes
      ctx.strokeStyle = "#666"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(50, centerY)
      ctx.lineTo(canvas.width - 50, centerY)
      ctx.moveTo(centerX, 50)
      ctx.lineTo(centerX, canvas.height - 50)
      ctx.stroke()

      // Axis labels
      ctx.fillStyle = "#333"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("x", canvas.width - 30, centerY - 10)
      ctx.fillText("y", centerX + 15, 30)

      // Draw function curve (parabola: f(x) = x²)
      ctx.strokeStyle = "#4ECDC4"
      ctx.lineWidth = 4
      ctx.shadowColor = "#4ECDC4"
      ctx.shadowBlur = 3

      ctx.beginPath()
      let firstPoint = true
      for (let x = 50; x < canvas.width - 50; x += 2) {
        const normalizedX = (x - centerX) / scale
        const y = centerY - normalizedX * normalizedX * scale * 0.5

        if (y >= 50 && y <= canvas.height - 50) {
          if (firstPoint) {
            ctx.moveTo(x, y)
            firstPoint = false
          } else {
            ctx.lineTo(x, y)
          }
        }
      }
      ctx.stroke()

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      // Animated point on curve
      const pointX = centerX + 40 * Math.sin(time * speed[0] * 0.05)
      const normalizedPointX = (pointX - centerX) / scale
      const pointY = centerY - normalizedPointX * normalizedPointX * scale * 0.5

      // Tangent line calculation (derivative: f'(x) = 2x)
      const slope = 2 * normalizedPointX
      const tangentLength = 60

      // Draw tangent line
      ctx.strokeStyle = "#FF6B6B"
      ctx.lineWidth = 3
      ctx.shadowColor = "#FF6B6B"
      ctx.shadowBlur = 5

      const tangentStartX = pointX - tangentLength
      const tangentStartY = pointY - tangentLength * slope
      const tangentEndX = pointX + tangentLength
      const tangentEndY = pointY + tangentLength * slope

      ctx.beginPath()
      ctx.moveTo(tangentStartX, tangentStartY)
      ctx.lineTo(tangentEndX, tangentEndY)
      ctx.stroke()

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      // Draw point with glow effect
      ctx.shadowColor = "#FFD700"
      ctx.shadowBlur = 10
      ctx.fillStyle = "#FFD700"
      ctx.beginPath()
      ctx.arc(pointX, pointY, 8, 0, 2 * Math.PI)
      ctx.fill()

      // Point outline
      ctx.shadowBlur = 0
      ctx.strokeStyle = "#FF8C00"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw slope triangle
      if (Math.abs(slope) > 0.1) {
        const triangleSize = 30
        const deltaX = triangleSize
        const deltaY = deltaX * slope

        ctx.strokeStyle = "#9B59B6"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])

        // Horizontal line
        ctx.beginPath()
        ctx.moveTo(pointX, pointY)
        ctx.lineTo(pointX + deltaX, pointY)
        ctx.stroke()

        // Vertical line
        ctx.beginPath()
        ctx.moveTo(pointX + deltaX, pointY)
        ctx.lineTo(pointX + deltaX, pointY + deltaY)
        ctx.stroke()

        // Hypotenuse (part of tangent line)
        ctx.setLineDash([])
        ctx.strokeStyle = "#FF6B6B"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(pointX, pointY)
        ctx.lineTo(pointX + deltaX, pointY + deltaY)
        ctx.stroke()

        // Labels for rise and run
        ctx.fillStyle = "#9B59B6"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Δx", pointX + deltaX / 2, pointY - 10)
        ctx.fillText("Δy", pointX + deltaX + 15, pointY + deltaY / 2)

        // Slope value
        ctx.fillStyle = "#FF6B6B"
        ctx.font = "bold 14px Arial"
        ctx.fillText(`slope = ${slope.toFixed(2)}`, pointX + deltaX + 30, pointY + deltaY - 10)
      }

      // Function and derivative labels
      ctx.fillStyle = "#4ECDC4"
      ctx.font = "16px Arial"
      ctx.textAlign = "left"
      ctx.fillText("f(x) = x²", 60, 80)

      ctx.fillStyle = "#FF6B6B"
      ctx.fillText("f'(x) = 2x", 60, 100)

      // Current values
      ctx.fillStyle = "#333"
      ctx.font = "14px Arial"
      ctx.fillText(`x = ${normalizedPointX.toFixed(2)}`, 60, 130)
      ctx.fillText(`f(x) = ${(normalizedPointX * normalizedPointX).toFixed(2)}`, 60, 150)
      ctx.fillText(`f'(x) = ${slope.toFixed(2)}`, 60, 170)

      // Add derivative interpretation
      ctx.fillStyle = "#666"
      ctx.font = "12px Arial"
      ctx.fillText("The derivative represents the", 60, 200)
      ctx.fillText("instantaneous rate of change", 60, 215)
      ctx.fillText("(slope of the tangent line)", 60, 230)

      time += 1
      animationRef.current = requestAnimationFrame(animate)
    }

    if (isPlaying) {
      animate()
    }
  }

  const initGenericSimulation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, title: string) => {
    let time = 0

    const animate = () => {
      if (!isPlaying) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Enhanced background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
      )
      gradient.addColorStop(0, "#667eea")
      gradient.addColorStop(1, "#764ba2")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Animated concentric circles with glow
      for (let i = 0; i < 4; i++) {
        const radius = 30 + i * 25 + 15 * Math.sin(time * speed[0] * 0.05 + i * 0.5)
        const hue = (time * 2 + i * 60) % 360

        ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`
        ctx.lineWidth = 3
        ctx.shadowColor = ctx.strokeStyle
        ctx.shadowBlur = 10

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        ctx.stroke()
      }

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      // Floating particles
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * 2 * Math.PI + time * 0.02
        const radius = 80 + 20 * Math.sin(time * 0.03 + i)
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        ctx.fillStyle = `hsl(${(time + i * 45) % 360}, 70%, 70%)`
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
      }

      // Central pulsing core
      const coreRadius = 15 + 5 * Math.sin(time * 0.1)
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius)
      coreGradient.addColorStop(0, "#FFD700")
      coreGradient.addColorStop(1, "#FF6B6B")

      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreRadius, 0, 2 * Math.PI)
      ctx.fill()

      // Title with glow effect
      ctx.shadowColor = "#FFF"
      ctx.shadowBlur = 5
      ctx.fillStyle = "#FFF"
      ctx.font = "bold 18px Arial"
      ctx.textAlign = "center"
      ctx.fillText(" Simulation", centerX, centerY + 120)

      ctx.shadowBlur = 3
      ctx.font = "14px Arial"
      ctx.fillText(title, centerX, centerY + 145)

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      time += 1
      animationRef.current = requestAnimationFrame(animate)
    }

    if (isPlaying) {
      animate()
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const reset = () => {
    setIsPlaying(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const toggleVideo = () => {
    setShowVideo(!showVideo)
    if (!showVideo && videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  useEffect(() => {
    if (isPlaying) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      if (demoId.includes("pendulum") || demoId.includes("phy-001")) {
        initPendulumSimulation(ctx, canvas)
      } else if (demoId.includes("wave") || demoId.includes("phy-003")) {
        initWaveSimulation(ctx, canvas)
      } else if (demoId.includes("circuit") || demoId.includes("phy-002")) {
        initCircuitSimulation(ctx, canvas)
      } else if (demoId.includes("electromagnetic") || demoId.includes("phy-006")) {
        initElectromagneticSimulation(ctx, canvas)
      } else if (demoId.includes("quantum") || demoId.includes("phy-007")) {
        initQuantumSimulation(ctx, canvas)
      } else if (demoId.includes("dna") || demoId.includes("bio-006")) {
        initDNASimulation(ctx, canvas)
      } else if (demoId.includes("derivative") || demoId.includes("math-006")) {
        initDerivativeSimulation(ctx, canvas)
      } else {
        initGenericSimulation(ctx, canvas, title)
      }
    }
  }, [isPlaying, speed, amplitude, demoId, title])

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simulation" className="flex items-center space-x-2">
            <Play className="h-4 w-4" />
            <span>Simulation</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center space-x-2" disabled={!videoUrl}>
            <Volume2 className="h-4 w-4" />
            <span>Video</span>
            {!videoUrl && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Coming Soon
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simulation" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Play className="h-5 w-5 text-blue-500" />
                  <span> Simulation</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}>
                <canvas
                  ref={canvasRef}
                  className={`w-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 ${
                    isFullscreen ? "h-full" : "h-80"
                  }`}
                />
                {isFullscreen && (
                  <Button variant="secondary" size="sm" onClick={toggleFullscreen} className="absolute top-4 right-4">
                    <Minimize2 className="h-4 w-4 mr-2" />
                    Exit Fullscreen
                  </Button>
                )}
              </div>

              <Separator />

              {/* Enhanced Controls */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={isPlaying ? "default" : "outline"}
                      size="sm"
                      onClick={togglePlayPause}
                      className="min-w-[100px]"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={reset}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>

                  <Separator orientation="vertical" className="h-8" />

                  <div className="flex items-center space-x-3 min-w-[150px]">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Speed</label>
                      <Slider value={speed} onValueChange={setSpeed} max={3} min={0.1} step={0.1} className="w-20" />
                    </div>
                    <span className="text-xs text-gray-500 min-w-[30px]">{speed[0].toFixed(1)}x</span>
                  </div>

                  {(demoId.includes("wave") || demoId.includes("pendulum")) && (
                    <>
                      <Separator orientation="vertical" className="h-8" />
                      <div className="flex items-center space-x-3 min-w-[150px]">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Amplitude</label>
                          <Slider
                            value={amplitude}
                            onValueChange={setAmplitude}
                            max={80}
                            min={10}
                            step={5}
                            className="w-20"
                          />
                        </div>
                        <span className="text-xs text-gray-500 min-w-[30px]">{amplitude[0]}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Simulation Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</div>
                    <div className={`text-lg font-bold ${isPlaying ? "text-green-600" : "text-gray-500"}`}>
                      {isPlaying ? "Running" : "Paused"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Speed</div>
                    <div className="text-lg font-bold text-blue-600">{speed[0].toFixed(1)}x</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Type</div>
                    <div className="text-lg font-bold text-purple-600">Interactive</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          {videoUrl ? (
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Volume2 className="h-5 w-5 text-green-500" />
                    <span>Educational Video</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {showVideo && videoLoaded && (
                      <Button variant="outline" size="sm" onClick={toggleMute}>
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={toggleVideo}>
                      {showVideo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="ml-2">{showVideo ? "Hide" : "Show"} Video</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {showVideo ? (
                  <div className="video-container">
                    <iframe
                      src={`${videoUrl}?enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
                      title={title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => setVideoLoaded(true)}
                      className="rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="video-container bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="play-button">
                        <Play className="h-8 w-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Educational Video Available
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Watch the video explanation to enhance your understanding
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                    <Volume2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Video Coming Soon</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Educational video content is being prepared for this demonstration
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
