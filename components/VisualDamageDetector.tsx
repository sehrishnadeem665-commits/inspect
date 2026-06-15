"use client"

import React, { useState, useRef, useEffect } from 'react'

type DamageResult = {
  totalDetected: number
  damages: Array<{
    type: 'Scratch' | 'Dent'
    severity: string
    confidence: number
    location: string
    boundingBox: {
      x: number
      y: number
      width: number
      height: number
    }
  }>
  overallAssessment: 'None' | 'Minor' | 'Moderate' | 'Severe'
  message: string
}

export default function VisualDamageDetector(): JSX.Element {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DamageResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement | null>(null)

  // Draw bounding boxes on image after result is loaded
  useEffect(() => {
    if (result && result.damages.length > 0 && imgRef.current && canvasRef.current) {
      const img = imgRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (!ctx) return

      // Set canvas size to match image
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      // Draw image on canvas
      ctx.drawImage(img, 0, 0)

      // Draw bounding boxes
      result.damages.forEach((damage, idx) => {
        const box = damage.boundingBox
        const color = damage.type === 'Dent' ? '#FF1493' : '#00CED1' // Pink for Dent, Cyan for Scratch
        const thickness = 3

        // Draw bounding box
        ctx.strokeStyle = color
        ctx.lineWidth = thickness
        ctx.strokeRect(box.x, box.y, box.width, box.height)

        // Draw label background
        const label = `${damage.type} ${(damage.confidence * 100).toFixed(0)}%`
        ctx.font = 'bold 14px Arial'
        const textMetrics = ctx.measureText(label)
        const textHeight = 20
        const padding = 5

        ctx.fillStyle = color
        ctx.fillRect(
          box.x,
          box.y - textHeight - padding,
          textMetrics.width + padding * 2,
          textHeight + padding
        )

        // Draw label text
        ctx.fillStyle = 'white'
        ctx.font = 'bold 14px Arial'
        ctx.fillText(label, box.x + padding, box.y - padding)

        // Draw damage number
        ctx.fillStyle = color
        ctx.font = 'bold 18px Arial'
        ctx.fillText(`${idx + 1}`, box.x + 5, box.y + 25)
      })
    }
  }, [result])

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setResult(null)
    setError(null)
    const f = e.target.files?.[0] ?? null
    setFile(f)
    if (f) {
      setPreviewUrl(URL.createObjectURL(f))
    } else {
      setPreviewUrl(null)
    }
  }

  function openImagePicker() {
    setError(null)
    // prefer programmatic click to open camera/gallery
    inputRef.current?.click()
  }

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)
    setResult(null)

    if (!file) {
      setError('Please select an image of the vehicle.')
      return
    }

    try {
      setLoading(true)
      const fd = new FormData()
      fd.append('image', file)

      const res = await fetch('/api/visual-damage/detect', {
        method: 'POST',
        body: fd,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'Failed to analyze image')
      }

      const data: DamageResult = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err?.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (result) {
      // scroll to result for better UX on mobile
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150)
    }
  }, [result])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Hero Section */}
        <section className="rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-indigo-900 text-white p-8 md:p-12 mb-10 shadow-2xl relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-black mb-3 leading-tight">🔍 Visual Damage Detection</h1>
                <p className="text-amber-100 text-sm sm:text-base md:text-xl max-w-3xl leading-relaxed">
                  Upload a photo of your vehicle to instantly detect and analyze damage using advanced AI technology. Get detailed reports on scratches, dents, and impact marks.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              {/* <button
                type="button"
                onClick={openImagePicker}
                className="inline-flex items-center justify-center gap-2 bg-white text-amber-700 font-bold px-7 py-4 rounded-xl hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl text-base md:text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                📸 Take a Photo
              </button> */}
              <button
                type="button"
                onClick={openImagePicker}
                className="inline-flex items-center justify-center gap-2 bg-amber-500/20 text-white font-semibold px-7 py-4 rounded-xl border-2 border-white/40 hover:border-white/60 hover:bg-amber-500/30 transition-all text-sm sm:text-base md:text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload from Gallery
              </button>
            </div>
          </div>
        </section>

      <form onSubmit={onSubmit} className="space-y-6">
        <label className="block">
          <span className="sr-only">Upload vehicle image</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onFileChange}
            className="hidden"
          />
        </label>

        {previewUrl && (
          <div className="rounded-2xl overflow-hidden bg-black relative shadow-2xl border-2 border-gray-300">
            {/* Hidden image for size reference */}
            <img
              ref={imgRef}
              src={previewUrl}
              alt="preview"
              className="hidden"
              onLoad={() => {
                // Trigger canvas redraw when image loads
                if (result) {
                  setTimeout(() => {
                    // Canvas will redraw due to useEffect
                  }, 0)
                }
              }}
            />
            
            {/* Canvas for drawing bounding boxes */}
            {result && result.damages.length > 0 ? (
              <canvas
                ref={canvasRef}
                className="w-full h-auto block"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
            ) : (
              <img src={previewUrl} alt="preview" className="w-full h-auto object-contain" />
            )}
            
            {/* Detection badge */}
            {result && (
              <div className="absolute bottom-4 right-4 bg-gradient-to-r from-amber-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                ✅ {result.totalDetected} damage{result.totalDetected !== 1 ? 's' : ''} found
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze Image
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setFile(null)
              setPreviewUrl(null)
              setResult(null)
              setError(null)
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        </div>

        {error && (
          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl text-amber-700 font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {result && (
          <div ref={resultRef} className="mt-8 space-y-6">
            {/* Overall Assessment Header */}
            <div className={`p-6 rounded-2xl border-2 shadow-lg ${
              result.overallAssessment === 'None' 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                : result.overallAssessment === 'Severe'
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300'
                : result.overallAssessment === 'Moderate'
                ? 'bg-gradient-to-br from-[#D0E3F1] to-[#9EB8D3] border-[#9EB8D3]'
                : 'bg-gradient-to-br from-[#D0E3F1] to-[#9EB8D3] border-[#9EB8D3]'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-lg sm:text-2xl font-black ${
                    result.overallAssessment === 'None' ? 'text-green-700' : result.overallAssessment === 'Severe' ? 'text-amber-700' : 'text-orange-700'
                  }`}>
                    {result.totalDetected === 0 
                      ? '✓ No Damage' 
                      : `⚠️ ${result.totalDetected} Damage${result.totalDetected !== 1 ? 's' : ''} Detected`}
                  </h2>
                  <p className="text-sm md:text-base text-gray-700 mt-2 font-medium">{result.message}</p>
                </div>
                <span className={`text-xs md:text-sm font-bold px-4 py-2 rounded-lg ${
                  result.overallAssessment === 'None'
                    ? 'bg-green-200 text-green-900'
                    : result.overallAssessment === 'Severe'
                    ? 'bg-amber-200 text-amber-900'
                    : result.overallAssessment === 'Moderate'
                    ? 'bg-orange-200 text-orange-900'
                    : 'bg-[#9EB8D3] text-[#7a5a33]'
                }`}>
                  {result.overallAssessment}
                </span>
              </div>
            </div>

            {/* Individual Damages */}
            {result.damages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Damage Details
                </h3>
                {result.damages.map((damage, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border-2 shadow-md hover:shadow-lg transition-all ${
                      damage.type === 'Dent'
                        ? 'bg-gradient-to-br from-pink-50 to-amber-50 border-pink-200'
                        : 'bg-gradient-to-br from-cyan-50 to-amber-50 border-cyan-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm text-white ${
                            damage.type === 'Dent' ? 'bg-pink-600' : 'bg-cyan-600'
                          }`}
                        >
                          {idx + 1}
                        </span>

                        <div>
                          <p
                            className={`font-bold text-sm sm:text-base md:text-lg ${
                              damage.type === 'Dent' ? 'text-pink-700' : 'text-cyan-700'
                            }`}
                          >
                            {damage.type === 'Dent' ? '🔨' : '💨'} {damage.type}
                          </p>
                          <p className="text-2xs sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">{damage.severity}</p>
                        </div>
                      </div>

                      <span
                        className={`text-xs md:text-sm font-bold px-3 py-1 rounded-full ${
                          damage.type === 'Dent' ? 'bg-pink-200 text-pink-800' : 'bg-cyan-200 text-cyan-800'
                        }`}
                      >
                        {(damage.confidence * 100).toFixed(1)}%
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 font-medium">
                      <span className="text-gray-600">📍</span> <strong>Location:</strong> {damage.location}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Get Full Report Button */}
            <div className="pt-4 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={() => {
                  const reportData = {
                    timestamp: new Date().toISOString(),
                    totalDamages: result.totalDetected,
                    assessment: result.overallAssessment,
                    damages: result.damages.map((d, i) => ({
                      number: i + 1,
                      type: d.type,
                      severity: d.severity,
                      confidence: (d.confidence * 100).toFixed(1) + '%',
                      location: d.location
                    })),
                    message: result.message
                  }
                  const reportContent = `
VEHICLE DAMAGE DETECTION REPORT
================================
Generated: ${new Date().toLocaleString()}

OVERALL ASSESSMENT: ${result.overallAssessment}
Total Damages Found: ${result.totalDetected}

${result.message}

DAMAGE DETAILS:
${result.damages.map((d, i) => `
${i + 1}. ${d.type} (${d.severity})
   Confidence: ${(d.confidence * 100).toFixed(1)}%
   Location: ${d.location}
`).join('')}
                  `
                  const blob = new Blob([reportContent], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `damage-report-${Date.now()}.txt`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all text-sm sm:text-base md:text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                📄 Get Full Report (Download)
              </button>
            </div>
          </div>
        )}
      </form>
      </div>
    </div>
  )
}

