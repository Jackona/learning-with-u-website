'use client'

import { useEffect, useRef, useState } from 'react'
import { Trash2, Download, Undo, Redo, ChevronDown } from 'lucide-react'

type Tool = 'pencil' | 'pen' | 'marker' | 'eraser'

const colours = [
  '#000000', '#1a1a2e', '#16213e', '#4a4e69',
  '#ef4444', '#f97316', '#f59e0b', '#22c55e',
  '#06b6d4', '#00A2E8', '#0077B6', '#8b5cf6',
  '#ec4899', '#f43f5e', '#ffffff', '#e5e7eb',
  '#FFED00', '#84cc16', '#14b8a6', '#6366f1',
  '#a855f7', '#fb923c', '#fdba74', '#86efac',
]

const brushSizes = [2, 5, 10, 20, 35]

export default function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<Tool>('pen')
  const [colour, setColour] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [bgColour, setBgColour] = useState('#ffffff')
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showColours, setShowColours] = useState(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    ctx.fillStyle = bgColour
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveHistory()
  }, [])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top }
  }

  const getToolConfig = (ctx: CanvasRenderingContext2D) => {
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    switch (tool) {
      case 'pencil':
        ctx.globalAlpha = 0.7
        ctx.lineWidth = brushSize * 0.8
        ctx.strokeStyle = colour
        break
      case 'marker':
        ctx.globalAlpha = 0.5
        ctx.lineWidth = brushSize * 3
        ctx.strokeStyle = colour
        break
      case 'eraser':
        ctx.globalAlpha = 1
        ctx.lineWidth = brushSize * 2
        ctx.strokeStyle = bgColour
        break
      default: // pen
        ctx.globalAlpha = 1
        ctx.lineWidth = brushSize
        ctx.strokeStyle = colour
    }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    lastPos.current = getPos(e)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing || !lastPos.current) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const pos = getPos(e)
    getToolConfig(ctx)
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
  }

  const endDraw = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    lastPos.current = null
    saveHistory()
  }

  const saveHistory = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(imageData)
      setHistoryIndex(newHistory.length - 1)
      return newHistory
    })
  }

  const undo = () => {
    if (historyIndex <= 0) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const newIndex = historyIndex - 1
    ctx.putImageData(history[newIndex], 0, 0)
    setHistoryIndex(newIndex)
  }

  const redo = () => {
    if (historyIndex >= history.length - 1) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const newIndex = historyIndex + 1
    ctx.putImageData(history[newIndex], 0, 0)
    setHistoryIndex(newIndex)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = bgColour
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveHistory()
  }

  const downloadArt = () => {
    const canvas = canvasRef.current!
    const link = document.createElement('a')
    link.download = 'my-artwork.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const tools: { id: Tool; emoji: string; label: string }[] = [
    { id: 'pencil', emoji: '✏️', label: 'Pencil' },
    { id: 'pen', emoji: '🖊️', label: 'Pen' },
    { id: 'marker', emoji: '🖍️', label: 'Marker' },
    { id: 'eraser', emoji: '🧹', label: 'Eraser' },
  ]

  return (
    <div className="pb-20 lg:pb-4 h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-3">
        <h1 className="text-2xl font-extrabold text-slate-900">🎨 Art Canvas</h1>
        <p className="text-slate-500 text-xs">Draw with your finger, mouse, or stylus</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border-2 border-slate-100 p-3 mb-3 flex flex-wrap gap-3 items-center shadow-sm">
        {/* Tools */}
        <div className="flex gap-2">
          {tools.map(t => (
            <button key={t.id} onClick={() => setTool(t.id)} title={t.label}
              className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all
                ${tool === t.id ? 'bg-[#00A2E8] shadow-md scale-110' : 'bg-slate-100 hover:bg-slate-200'}`}>
              {t.emoji}
            </button>
          ))}
        </div>

        <div className="w-px h-8 bg-slate-200" />

        {/* Brush size */}
        <div className="flex gap-2 items-center">
          {brushSizes.map(s => (
            <button key={s} onClick={() => setBrushSize(s)}
              className={`rounded-full flex items-center justify-center transition-all
                ${brushSize === s ? 'ring-2 ring-[#00A2E8]' : ''}`}
              style={{ width: Math.max(s + 8, 20), height: Math.max(s + 8, 20), backgroundColor: colour }}>
            </button>
          ))}
        </div>

        <div className="w-px h-8 bg-slate-200" />

        {/* Colour picker */}
        <div className="relative">
          <button onClick={() => setShowColours(!showColours)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors font-semibold text-sm">
            <div className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: colour }} />
            Colour <ChevronDown size={14} />
          </button>
          {showColours && (
            <div className="absolute top-12 left-0 z-50 bg-white rounded-2xl shadow-2xl border-2 border-slate-100 p-3 grid grid-cols-6 gap-2 w-48">
              {colours.map(c => (
                <button key={c} onClick={() => { setColour(c); setShowColours(false) }}
                  className={`w-7 h-7 rounded-full border-2 hover:scale-110 transition-all
                    ${colour === c ? 'border-slate-500 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex gap-2">
          <button onClick={undo} disabled={historyIndex <= 0} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-40" title="Undo">
            <Undo size={18} />
          </button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-40" title="Redo">
            <Redo size={18} />
          </button>
          <button onClick={clearCanvas} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors" title="Clear">
            <Trash2 size={18} />
          </button>
          <button onClick={downloadArt} className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors" title="Save">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>

      <p className="text-center text-xs text-slate-400 mt-2">Tip: Use touch on tablets or a stylus for best results ✏️</p>
    </div>
  )
}
