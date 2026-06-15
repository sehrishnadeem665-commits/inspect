import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const ownerName = formData.get('ownerName') as string
    const ownerEmail = formData.get('ownerEmail') as string
    const ownerPhone = formData.get('ownerPhone') as string || ''
    const vehicleTitle = formData.get('vehicleTitle') as string
    const vehicleYear = formData.get('vehicleYear') as string
    const vehicleMake = formData.get('vehicleMake') as string
    const vehicleModel = formData.get('vehicleModel') as string
    const vehicleType = formData.get('vehicleType') as string
    const vin = formData.get('vin') as string || null
    const licensePlate = formData.get('licensePlate') as string || null
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const currency = formData.get('currency') as string || 'USD'

    // Validate required fields
    const missingFields = []
    if (!ownerName) missingFields.push('ownerName')
    if (!ownerEmail) missingFields.push('ownerEmail')
    if (!ownerPhone) missingFields.push('ownerPhone')
    if (!vehicleTitle) missingFields.push('vehicleTitle')
    if (!vehicleMake) missingFields.push('vehicleMake')
    if (!vehicleModel) missingFields.push('vehicleModel')
    if (!vehicleType) missingFields.push('vehicleType')
    if (!price) missingFields.push('price')
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Get images but don't convert to base64 yet
    const imageFiles = formData.getAll('images') as File[]
    
    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: 'At least 1 image is required' },
        { status: 400 }
      )
    }

    // Generate registration number using timestamp and random string
    const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase()
    const registrationNumber = `VR-${Date.now()}-${randomStr}`

    // Save registration to database (without images first)
    const result = await query(
      `INSERT INTO vehicle_registrations (
        registration_number, owner_name, owner_phone, owner_email, vehicle_title, 
        vehicle_year, vehicle_make, vehicle_model, vehicle_type, 
        vin, license_plate, description, price, currency, 
        approval_status, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        registrationNumber,
        ownerName,
        ownerPhone,
        ownerEmail,
        vehicleTitle,
        vehicleYear || null,
        vehicleMake,
        vehicleModel,
        vehicleType,
        vin,
        licensePlate,
        description,
        parseFloat(price),
        currency,
        'pending',
        'pending'
      ]
    )

    console.log('INSERT result:', result)
    const registrationId = result?.insertId || (result?.rows as any)?.insertId
    
    if (!registrationId) {
      console.error('No insertId in result:', result)
      throw new Error('Failed to get registration ID from database')
    }

    // Now save images to separate table with binary data
    let imageCount = 0
    for (const file of imageFiles) {
      try {
        const buffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(buffer)
        
        await query(
          `INSERT INTO vehicle_registration_images (
            registration_id, image_name, image_type, image_size, image_data, display_order
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            registrationId,
            file.name,
            file.type,
            file.size,
            uint8Array,
            imageCount
          ]
        )
        imageCount++
      } catch (imageErr) {
        console.error(`Error saving image ${file.name}:`, imageErr)
        // Continue with other images if one fails
      }
    }

    console.log(`Saved ${imageCount} images for registration ${registrationId}`)

    return NextResponse.json({
      success: true,
      registrationId,
      registrationNumber,
      imagesCount: imageCount,
    })
  } catch (error) {
    console.error('Error creating vehicle registration:', error)
    const errorMsg = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: `Failed to create vehicle registration: ${errorMsg}` },
      { status: 500 }
    )
  }
}
