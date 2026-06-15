import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function POST(req: NextRequest) {
  try {
    const { registrationId, paymentId } = await req.json()

    if (!registrationId || !paymentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update registration with payment info
    await query(
      `UPDATE vehicle_registrations 
       SET payment_id = ?, payment_status = ?, updated_at = NOW()
       WHERE id = ?`,
      [paymentId, 'completed', registrationId]
    )

    // Get the registration details
    const result = await query(
      `SELECT owner_email, owner_name, registration_number, vehicle_title 
       FROM vehicle_registrations 
       WHERE id = ?`,
      [registrationId]
    )
    const registrations = result.rows

    if ((registrations as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    const registration = (registrations as any[])[0]

    // Send confirmation email to owner
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: registration.owner_email,
          subject: 'Vehicle Registration Payment Received',
          template: 'vehicle_registration_payment_received',
          data: {
            ownerName: registration.owner_name,
            vehicleTitle: registration.vehicle_title,
            registrationNumber: registration.registration_number,
          },
        }),
      })
    } catch (err) {
      console.error('Failed to send payment confirmation email:', err)
      // Don't fail the response, just log the error
    }

    return NextResponse.json({
      success: true,
      message: 'Payment recorded successfully',
    })
  } catch (error) {
    console.error('Error completing payment:', error)
    return NextResponse.json(
      { error: 'Failed to complete payment' },
      { status: 500 }
    )
  }
}
