# Visual Damage Detection System

Professional-grade car damage detection integration using Roboflow AI.

## Overview

The Visual Damage Detection system provides real-time analysis of vehicle damage through image upload, with intelligent fallback to mock detection when the AI service is unavailable.

### Features

✅ **AI-Powered Detection** - Roboflow Serverless API integration  
✅ **Damage Classification** - Scratch, Dent, or No Damage  
✅ **Location Estimation** - Precise damage location mapping  
✅ **Intelligent Fallback** - Mock detection when API unavailable  
✅ **Production-Ready** - Proper error handling, validation, logging  
✅ **TypeScript** - Full type safety and intellisense  
✅ **Performance** - Optimized request handling with timeout  

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Next.js Client Component)                         │
│ - VisualDamageDetector.tsx                                 │
│ - Image upload, preview, result display                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ FormData POST
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend API Route                                           │
│ - app/api/visual-damage/detect/route.ts                    │
│ - Input validation, request orchestration                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
        ┌──────────────┐  ┌──────────────┐
        │ Roboflow API │  │ Mock Fallback│
        │   (Real AI)  │  │   (Backup)   │
        └──────────────┘  └──────────────┘
```

## File Structure

```
project/
├── components/
│   └── VisualDamageDetector.tsx       # Client component (UI)
├── app/
│   ├── api/
│   │   └── visual-damage/
│   │       └── detect/
│   │           └── route.ts           # API endpoint
│   └── visual-damage/
│       └── page.tsx                   # Page component
├── lib/
│   └── roboflow.ts                    # Roboflow integration logic
└── docs/
    └── VISUAL_DAMAGE_DETECTION.md     # This file
```

## Configuration

### Environment Variables

Set these in `.env.local`:

```env
# Roboflow API Configuration (REQUIRED FOR REAL DETECTION)
ROBOFLOW_API_KEY=2PduCgVhPOFFq5n0pgYW
```

### Model Details

| Property | Value |
|----------|-------|
| **Model ID** | `damage-detection-rzybm-lxbho/1` |
| **API URL** | `https://serverless.roboflow.com` |
| **Model Type** | Object Detection |
| **Damage Classes** | Scratch, Dent |
| **Confidence Range** | 0-100 (normalized to 0-1) |

## API Endpoint

### `POST /api/visual-damage/detect`

Analyzes a vehicle image for damage.

#### Request

```bash
curl -X POST http://localhost:3000/api/visual-damage/detect \
  -F "image=@car_image.jpg"
```

**Content-Type:** `multipart/form-data`

**Body:**
- `image` (File, required): JPEG, PNG, or WebP image file (max 20MB)

#### Response (Success)

```json
{
  "damageType": "Scratch",
  "location": "front bumper",
  "confidence": 0.8534,
  "message": "Visible paint abrasion consistent with a surface scratch."
}
```

**Response Type:**
- `damageType`: `"Scratch"` | `"Dent"` | `"None"`
- `location`: string (estimated damage location)
- `confidence`: number (0-1, confidence score)
- `message`: string (human-readable description)

#### Response (Error)

```json
{
  "error": "File size exceeds 20MB limit",
  "code": "FILE_TOO_LARGE",
  "timestamp": "2025-02-05T12:34:56.789Z"
}
```

**Error Codes:**
- `MISSING_FILE` - No image file provided
- `INVALID_MIME_TYPE` - Unsupported file format
- `FILE_TOO_LARGE` - File exceeds 20MB
- `PROCESSING_ERROR` - Server error during processing

## Console Logging

The API provides detailed console output for debugging:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📨 Visual Damage Detection Request [req_1738761234_abc123def]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ File validation passed
📊 File info: car_image.jpg | image/jpeg | 245.67KB

🔄 Attempting Roboflow AI detection...
🔍 Sending damage detection request to Roboflow...
📍 Endpoint: https://serverless.roboflow.com/damage-detection-rzybm-lxbho/1
📦 Image size: 245.67 KB
✅ Roboflow API response received (1234ms)
📊 Predictions found: 2
🎯 Predictions: [...]
🔎 Parsed result: {...}

✅ SUCCESS: Real AI Detection
🎯 Result: {
  damageType: "Scratch",
  confidence: "85.34%",
  location: "front bumper",
  isRealDetection: true
}
⏱️  Total time: 1456ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Component Usage

```typescript
import VisualDamageDetector from '@/components/VisualDamageDetector'

export default function Page() {
  return (
    <main className="container mx-auto px-6 py-10">
      <VisualDamageDetector />
    </main>
  )
}
```

## Damage Location Mapping

The system automatically maps bounding boxes to car locations:

| Location | Coverage |
|----------|----------|
| Front Bumper | Lower center (y: 0.7-1.0) |
| Front Left Fender | Left side upper (x: 0-0.35, y: 0.3-0.65) |
| Front Right Fender | Right side upper (x: 0.65-1.0, y: 0.3-0.65) |
| Roof | Top center (y: 0-0.3) |
| Rear Left Door | Left side middle (x: 0-0.35, y: 0.3-0.7) |
| Rear Right Door | Right side middle (x: 0.65-1.0, y: 0.3-0.7) |
| Rear Bumper | Lower center (y: 0.7-1.0) |
| Left Mirror | Left edge (x: 0-0.15, y: 0.2-0.5) |
| Right Mirror | Right edge (x: 0.85-1.0, y: 0.2-0.5) |

## Development

### Testing Locally

```bash
# Start development server
npm run dev

# Visit the UI
open http://localhost:3000/visual-damage

# Check server logs in terminal
# Look for console output showing API calls
```

### Testing API Directly

```bash
# Test with a real image
curl -X POST http://localhost:3000/api/visual-damage/detect \
  -F "image=@path/to/car_damage.jpg" \
  -H "Accept: application/json"

# Test with an invalid file
curl -X POST http://localhost:3000/api/visual-damage/detect \
  -F "image=@path/to/document.pdf"
```

## Performance Considerations

| Metric | Value |
|--------|-------|
| **Request Timeout** | 30 seconds |
| **Max Image Size** | 20 MB |
| **Typical Response Time** | 1-3 seconds (Roboflow) |
| **Fallback Time** | <100ms (mock) |
| **Concurrent Requests** | No limit (serverless) |

## Error Handling

The system handles various failure scenarios:

1. **Missing API Key** → Uses mock fallback
2. **Network Timeout** → Uses mock fallback with logging
3. **Invalid Image** → Returns 400 error with specific code
4. **API Error** → Logs error, uses mock fallback
5. **Parsing Error** → Uses mock fallback with error log

## Future Enhancements

- [ ] Confidence threshold adjustment
- [ ] Multiple damage detection in single image
- [ ] Cost estimation based on damage
- [ ] Historical damage tracking
- [ ] Image quality validation
- [ ] Real-time damage video analysis
- [ ] Mobile app native integration

## Support & Troubleshooting

### "No damage detected" appears for obvious damage

**Solution:** The AI model might not recognize that specific type of damage. Check:
1. Image quality and lighting
2. Damage clarity in the image
3. Check console logs for actual confidence score

### "Using mock fallback" appears

**Causes:**
- `ROBOFLOW_API_KEY` not set in `.env.local`
- Network connectivity issue
- Roboflow service outage
- Request timeout

**Solution:** Check `.env.local` and server logs

### Slow responses

**Causes:**
- Slow network to Roboflow
- Large image file
- Server overload

**Solution:**
- Compress image before upload
- Check internet connection
- Reduce image resolution

## References

- [Roboflow Documentation](https://docs.roboflow.com)
- [Roboflow Serverless API](https://docs.roboflow.com/serverless/)
- [Model: damage-detection-rzybm-lxbho](https://universe.roboflow.com/)

---

**Last Updated:** February 5, 2026  
**Status:** Production Ready ✅
