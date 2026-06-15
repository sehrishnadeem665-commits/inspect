import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(req: NextRequest) {
  try {
    // Fetch only approved and paid vehicles
    const result = await query(
      `SELECT * FROM vehicle_registrations 
       WHERE approval_status = 'approved' AND payment_status = 'completed'
       ORDER BY approved_at DESC`
    )
    const vehicles = result.rows || []

    // For each vehicle, fetch images from vehicle_registration_images and attach as images_json
    const vehiclesWithImages = []
    for (const v of vehicles as any[]) {
      const imgsRes = await query(
        `SELECT image_name, image_type, image_size, image_data, display_order FROM vehicle_registration_images WHERE registration_id = ? ORDER BY display_order ASC`,
        [v.id]
      )
      const imgs = (imgsRes.rows || []).map((img: any) => ({
        name: img.image_name,
        type: img.image_type,
        size: img.image_size,
        data: img.image_data ? Buffer.from(img.image_data).toString('base64') : null,
        order: img.display_order,
      }))

      // Provide images_json string for front-end compatibility
      v.images_json = JSON.stringify(imgs)
      vehiclesWithImages.push(v)
    }

    return NextResponse.json({
      success: true,
      data: vehiclesWithImages,
      total: vehiclesWithImages.length,
    })
  } catch (error) {
    console.error('Error fetching registered vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}
