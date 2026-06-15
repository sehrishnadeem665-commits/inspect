import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { vin } = await request.json()

    if (!vin || vin.trim().length < 3) {
      return NextResponse.json(
        { error: 'Valid VIN required' },
        { status: 400 }
      )
    }

    // Call NHTSA API to decode VIN
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${encodeURIComponent(vin)}?format=json`,
      { method: 'GET' }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to decode VIN' },
        { status: 500 }
      )
    }

    const data = await response.json()

    // Extract key information from NHTSA response
    const results = data.Results || []
    const vehicleInfo: Record<string, string | null> = {}

    results.forEach((item: any) => {
      if (item.Variable && item.Value) {
        vehicleInfo[item.Variable] = item.Value
      }
    })

    // Return formatted basic vehicle information
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
        driveType: vehicleInfo['Drive Type'] || 'N/A',
      },
      rawData: vehicleInfo,
    })
  } catch (error) {
    console.error('Error decoding VIN:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
