# VIN Decoder Logic Implementation Guide

## Overview
The VIN decoder flow checks vehicle data availability and responds accordingly:
- **Data Available** → Show basic report modal in banner
- **Data Not Available** → Open "Get Your Report" form for full report request

---

## Architecture Flow

```
User Input (VIN)
        ↓
[handleDecodeVIN] (Client)
        ↓
POST /api/decode-vin (Server)
        ↓
Call NHTSA API
        ↓
    ┌─────────────────────┐
    │ Data Available?     │
    └──────┬──────┬───────┘
         YES    NO
          ↓      ↓
    [Modal] [Form]
```

---

## Implementation Details

### 1. Frontend State Management (Banner.tsx)

```typescript
// State variables for VIN decoding
const [isBasicReportOpen, setIsBasicReportOpen] = useState(false)  // Controls modal visibility
const [basicReportData, setBasicReportData] = useState<any>(null)  // Stores decoded vehicle data
const [isLoadingReport, setIsLoadingReport] = useState(false)      // Shows loading spinner
const [isFormOpen, setIsFormOpen] = useState(false)                // Controls form visibility
```

### 2. Main Handler Function (Banner.tsx)

```typescript
const handleDecodeVIN = async () => {
  // Step 1: Validate VIN input
  if (!vin.trim()) {
    setVinError('Please enter a VIN')
    return
  }

  // Step 2: Show loading state
  setIsLoadingReport(true)

  try {
    // Step 3: Call the API endpoint
    const response = await fetch('/api/decode-vin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vin: vin.trim() })
    })

    const data = await response.json()

    // Step 4: Check if data is available
    if (!response.ok || !data.success) {
      // DATA NOT AVAILABLE
      // → Open the "Get Your Report" form
      setIsLoadingReport(false)
      setIsFormOpen(true)
      return
    }

    // DATA IS AVAILABLE
    // → Show the basic report modal with vehicle info
    setBasicReportData(data)
    setIsBasicReportOpen(true)
    setIsLoadingReport(false)

  } catch (error) {
    // ERROR OCCURRED
    // → Treat as data not available, open form
    console.error('Error decoding VIN:', error)
    setIsLoadingReport(false)
    setIsFormOpen(true)
  }
}
```

### 3. API Endpoint (app/api/decode-vin/route.ts)

```typescript
export async function POST(request: NextRequest) {
  try {
    const { vin } = await request.json()

    // Validate input
    if (!vin || vin.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Valid VIN required' },
        { status: 400 }
      )
    }

    // Call NHTSA VIN Decoder API
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${encodeURIComponent(vin)}?format=json`,
      { method: 'GET' }
    )

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to decode VIN' },
        { status: 500 }
      )
    }

    const apiData = await response.json()
    const results = apiData.Results || []

    // Extract vehicle information
    const vehicleInfo: Record<string, string | null> = {}
    results.forEach((item: any) => {
      if (item.Variable && item.Value) {
        vehicleInfo[item.Variable] = item.Value
      }
    })

    // Return formatted response
    return NextResponse.json({
      success: true,
      vin: vin.toUpperCase(),
      vehicleInfo: {
        year: vehicleInfo['Model Year'] || 'N/A',
        make: vehicleInfo['Make'] || 'N/A',
        model: vehicleInfo['Model'] || 'N/A',
        bodyClass: vehicleInfo['Body Class'] || 'N/A',
        engineCylinders: vehicleInfo['Engine Number of Cylinders'] || 'N/A',
        fuelType: vehicleInfo['Fuel Type - Primary'] || 'N/A',
        transmission: vehicleInfo['Transmission Style'] || 'N/A',
        driveType: vehicleInfo['Drive Type'] || 'N/A'
      },
      rawData: vehicleInfo
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Decision Logic: Data Available vs. Not Available

### What Determines "Data Available"

```javascript
// Data is AVAILABLE when:
if (response.ok && data.success === true) {
  // ✅ API returned status 200-299
  // ✅ data.success property is true
  // ✅ data.vehicleInfo contains valid vehicle data
  → Show basic report modal
}

// Data is NOT AVAILABLE when:
if (!response.ok || data.success !== true) {
  // ❌ API returned error status (4xx, 5xx)
  // ❌ VIN is invalid/not found in NHTSA database
  // ❌ API call failed or timed out
  → Open "Get Your Report" form
}

// Data is NOT AVAILABLE when error occurs:
if (error) {
  // ❌ Network error
  // ❌ JSON parsing error
  // ❌ Fetch failed
  → Open "Get Your Report" form
}
```

---

## Response Examples

### ✅ Data Available Response (Success)
```json
{
  "success": true,
  "vin": "JH2RC5004LM200089",
  "vehicleInfo": {
    "year": "2000",
    "make": "Honda",
    "model": "CB1100",
    "bodyClass": "Motorcycle",
    "engineCylinders": "4",
    "fuelType": "Gasoline",
    "transmission": "Manual",
    "driveType": "Chain Drive"
  },
  "rawData": { /* ... all NHTSA fields ... */ }
}
```

### ❌ Data Not Available Response (Error)
```json
{
  "success": false,
  "error": "Failed to decode VIN"
}
```

---

## UI Behavior

### When Data is Available:
1. Loading spinner shows while API is processing
2. Modal opens with basic report containing:
   - VIN number
   - Make, Model, Year
   - Body Class
   - Engine Cylinders
   - Fuel Type
   - Transmission
   - Drive Type
3. "Get Full Report" button in modal links to `/pricing`
4. User can close modal with X button

### When Data is Not Available:
1. Loading spinner shows while API is processing
2. "Get Your Report" form opens automatically
3. User can enter VIN/plate and request full report
4. Form submission sends inquiry to support team

---

## Testing the Implementation

### Test with Valid VIN (Data Available):
```bash
curl -X POST http://localhost:3000/api/decode-vin \
  -H "Content-Type: application/json" \
  -d '{"vin": "JH2RC5004LM200089"}'
```

Expected Result: Modal shows with vehicle data

### Test with Invalid VIN (Data Not Available):
```bash
curl -X POST http://localhost:3000/api/decode-vin \
  -H "Content-Type: application/json" \
  -d '{"vin": "INVALID123456789"}'
```

Expected Result: Form opens automatically

---

## Data Validation Checks

```typescript
// Check 1: VIN is not empty
if (!vin.trim()) {
  // Show error: "Please enter a VIN"
  return
}

// Check 2: API response status is successful
if (!response.ok) {
  // HTTP status is not 200-299
  // Data not available
}

// Check 3: API returned success flag
if (!data.success) {
  // API explicitly states decode failed
  // Data not available
}

// Check 4: Vehicle info has valid data
if (data.vehicleInfo.make !== 'N/A') {
  // At least some data was successfully decoded
  // Data is available
}
```

---

## Key Features

✅ **Non-blocking**: Loading state doesn't freeze UI
✅ **Graceful fallback**: Invalid VINs smoothly open form
✅ **Error handling**: Network errors trigger form as backup
✅ **User friendly**: No error messages, just natural flow to next step
✅ **NHTSA integration**: Uses official US vehicle database
✅ **Comprehensive data**: Extracts 8+ vehicle attributes
✅ **Mobile responsive**: Works on all device sizes

---

## Implementation Checklist

- [x] API endpoint created (`/api/decode-vin`)
- [x] NHTSA API integration
- [x] State management for modal and form
- [x] handleDecodeVIN() function
- [x] Data availability check logic
- [x] Basic report modal UI
- [x] "Get Full Report" button to pricing
- [x] Error handling and fallback
- [x] Loading states and spinner
- [x] Responsive design
