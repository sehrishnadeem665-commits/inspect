import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

// GET images for a specific vehicle registration
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const registrationId = parseInt(id, 10)

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Invalid registration ID' },
        { status: 400 }
      )
    }

    const result = await query(
      `SELECT id, image_name, image_type, image_size, image_data, display_order
       FROM vehicle_registration_images
       WHERE registration_id = ?
       ORDER BY display_order ASC`,
      [registrationId]
    )

    const images = result.rows || []

    // Convert BLOB data to base64 for response
    const imagesWithData = (images as any[]).map(img => ({
      id: img.id,
      name: img.image_name,
      type: img.image_type,
      size: img.image_size,
      data: img.image_data ? Buffer.from(img.image_data).toString('base64') : null,
      order: img.display_order,
    }))

    return NextResponse.json({
      success: true,
      data: imagesWithData,
      total: imagesWithData.length,
    })
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}
