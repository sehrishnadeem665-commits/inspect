/**
 * Roboflow Damage Detection Integration
 * Professional-grade implementation for car damage detection
 * Model: damage-detection-rzybm-lxbho/1
 */

export type RoboflowPrediction = {
  class: string
  confidence: number
  x: number
  y: number
  width: number
  height: number
  detection_id?: string
}

export type RoboflowResponse = {
  predictions: RoboflowPrediction[]
  image: {
    width: number
    height: number
  }
  model_id: string
  model_type: string
  time: number
}

export type DamageDetectionResult = {
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

// Validation and Constants
const ROBOFLOW_API_URL = 'https://serverless.roboflow.com'
const ROBOFLOW_API_KEY = process.env.ROBOFLOW_API_KEY || ''
const ROBOFLOW_MODEL_ID = 'damage-detection-rzybm-lxbho/1'
const REQUEST_TIMEOUT_MS = 30000
const MAX_IMAGE_SIZE = 20 * 1024 * 1024 // 20MB

// Damage type mappings
const DAMAGE_TYPE_MAPPINGS: Record<string, 'Scratch' | 'Dent'> = {
  // Severity levels from Roboflow model
  severe: 'Dent',
  major: 'Dent',
  moderate: 'Dent',
  minor: 'Scratch',
  // Direct damage type names
  scratch: 'Scratch',
  scratches: 'Scratch',
  dent: 'Dent',
  dents: 'Dent',
  damage: 'Dent',
  collision: 'Dent',
  impact: 'Dent',
  paint: 'Scratch',
}

// Location mapping based on bounding box position
const LOCATION_MAP: Array<{
  name: string
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number }
}> = [
  { name: 'front bumper', bounds: { xMin: 0.2, xMax: 0.8, yMin: 0.7, yMax: 1.0 } },
  { name: 'front left fender', bounds: { xMin: 0, xMax: 0.35, yMin: 0.3, yMax: 0.65 } },
  { name: 'front right fender', bounds: { xMin: 0.65, xMax: 1.0, yMin: 0.3, yMax: 0.65 } },
  { name: 'roof', bounds: { xMin: 0.2, xMax: 0.8, yMin: 0, yMax: 0.3 } },
  { name: 'rear left door', bounds: { xMin: 0, xMax: 0.35, yMin: 0.3, yMax: 0.7 } },
  { name: 'rear right door', bounds: { xMin: 0.65, xMax: 1.0, yMin: 0.3, yMax: 0.7 } },
  { name: 'rear bumper', bounds: { xMin: 0.2, xMax: 0.8, yMin: 0.7, yMax: 1.0 } },
  { name: 'left mirror', bounds: { xMin: 0, xMax: 0.15, yMin: 0.2, yMax: 0.5 } },
  { name: 'right mirror', bounds: { xMin: 0.85, xMax: 1.0, yMin: 0.2, yMax: 0.5 } },
]

/**
 * Validates image file before sending to API
 */
function validateImageFile(buffer: ArrayBuffer, contentType: string): { valid: boolean; error?: string } {
  if (buffer.byteLength === 0) {
    return { valid: false, error: 'Image buffer is empty' }
  }

  if (buffer.byteLength > MAX_IMAGE_SIZE) {
    return { valid: false, error: `Image exceeds maximum size of ${MAX_IMAGE_SIZE / 1024 / 1024}MB` }
  }

  if (!contentType.startsWith('image/')) {
    return { valid: false, error: 'Invalid image content type' }
  }

  return { valid: true }
}

/**
 * Send image to Roboflow API with proper error handling and logging
 */
export async function detectDamageFromRoboflow(
  imageBuffer: ArrayBuffer,
  contentType: string = 'image/jpeg'
): Promise<DamageDetectionResult | null> {
  try {
    // Validate API key
    if (!ROBOFLOW_API_KEY) {
      console.warn('⚠️ ROBOFLOW_API_KEY not configured, using fallback detection')
      return null
    }

    // Validate image
    const validation = validateImageFile(imageBuffer, contentType)
    if (!validation.valid) {
      console.error('❌ Image validation failed:', validation.error)
      return null
    }

    // Prepare request
    const formData = new FormData()
    const blob = new Blob([imageBuffer], { type: contentType })
    formData.append('file', blob, 'image.jpg')

    const url = `${ROBOFLOW_API_URL}/${ROBOFLOW_MODEL_ID}?api_key=${ROBOFLOW_API_KEY}&confidence=40`

    console.log(`🔍 Sending damage detection request to Roboflow...`)
    console.log(`📍 Endpoint: ${ROBOFLOW_API_URL}/${ROBOFLOW_MODEL_ID}`)
    console.log(`📦 Image size: ${(imageBuffer.byteLength / 1024).toFixed(2)} KB`)

    // Make API call with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    let response: Response
    try {
      response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeoutId)
    }

    // Handle response
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Roboflow API error (${response.status}):`, errorText)
      return null
    }

    const data: RoboflowResponse = await response.json()
    console.log(`✅ Roboflow API response received (${data.time}ms)`)
    console.log(`📊 Predictions found: ${data.predictions.length}`)

    if (data.predictions.length > 0) {
      console.log(`🎯 Predictions:`, JSON.stringify(data.predictions, null, 2))
    }

    // Parse predictions
    const result = parseRoboflowPredictions(data.predictions, data.image)
    console.log(`🔎 Parsed result:`, result)

    return result
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('❌ Roboflow API request timeout')
      } else {
        console.error('❌ Roboflow API request failed:', error.message)
      }
    } else {
      console.error('❌ Unexpected error during damage detection:', error)
    }
    return null
  }
}

function parseRoboflowPredictions(
  predictions: RoboflowPrediction[],
  imageInfo: { width: number; height: number }
): DamageDetectionResult {
  if (!Array.isArray(predictions) || predictions.length === 0) {
    console.log('⚠️ No damage predictions from Roboflow')
    return {
      damages: [],
      overallAssessment: 'None',
      message: 'No obvious visual damage detected in the provided image.',
    }
  }

  console.log(`📋 Processing ${predictions.length} predictions from Roboflow`)

  const damages = []

  // Process ALL predictions (not just highest confidence)
  for (const pred of predictions) {
    if (!pred.class || typeof pred.confidence !== 'number') {
      console.warn('⚠️ Invalid prediction format:', pred)
      continue
    }

    const className = pred.class.toLowerCase().trim()
    // Roboflow returns confidence as decimal (0-1)
    const confidenceScore = Math.min(1, Math.max(0, pred.confidence))

    console.log(`  - Class: "${pred.class}" | Confidence: ${(confidenceScore * 100).toFixed(1)}%`)

    // Map to known damage types
    const mappedType = DAMAGE_TYPE_MAPPINGS[className]
    if (mappedType) {
      const location = estimateDamageLocation(pred, imageInfo)
      damages.push({
        type: mappedType,
        severity: className,
        confidence: Number(confidenceScore.toFixed(4)),
        location,
        boundingBox: {
          x: pred.x,
          y: pred.y,
          width: pred.width,
          height: pred.height,
        },
      })
    }
  }

  // Determine overall assessment
  let overallAssessment: 'None' | 'Minor' | 'Moderate' | 'Severe' = 'None'
  if (damages.length > 0) {
    const maxConfidence = Math.max(...damages.map(d => d.confidence))
    if (maxConfidence > 0.8) overallAssessment = 'Severe'
    else if (maxConfidence > 0.6) overallAssessment = 'Moderate'
    else overallAssessment = 'Minor'
  }

  const message = damages.length === 0 
    ? 'No obvious visual damage detected in the provided image.'
    : `${damages.length} damage(s) detected: ${damages.map(d => d.severity).join(', ')}`

  const result: DamageDetectionResult = {
    damages,
    overallAssessment,
    message,
  }

  return result
}

/**
 * Estimate damage location from bounding box coordinates
 */
function estimateDamageLocation(
  prediction: RoboflowPrediction | undefined,
  imageInfo: { width: number; height: number }
): string {
  if (!prediction) {
    return 'unknown'
  }

  // Normalize coordinates to 0-1 range
  const normalizedX = prediction.x / imageInfo.width
  const normalizedY = prediction.y / imageInfo.height

  // Find matching location zone
  for (const zone of LOCATION_MAP) {
    const { xMin, xMax, yMin, yMax } = zone.bounds
    if (normalizedX >= xMin && normalizedX <= xMax && normalizedY >= yMin && normalizedY <= yMax) {
      return zone.name
    }
  }

  return 'other area'
}
