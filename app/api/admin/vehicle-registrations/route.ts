import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import { validateToken, getEmailFromToken } from '@/lib/auth'

// GET all vehicle registrations (admin only)
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await query(
      `SELECT * FROM vehicle_registrations 
       ORDER BY created_at DESC`
    )
    const registrations = result.rows

    return NextResponse.json({
      success: true,
      data: registrations,
      total: (registrations as any[]).length,
    })
  } catch (error) {
    console.error('Error fetching vehicle registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}

// Approve or reject a registration
export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { registrationId, action, adminNotes } = await req.json()

    if (!registrationId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    // token already validated above
    const adminEmail = getEmailFromToken(token)

    const newStatus = action === 'approve' ? 'approved' : 'rejected'

    // Update registration. If approving, mark payment as completed so listing becomes public.
    if (action === 'approve') {
      await query(
        `UPDATE vehicle_registrations 
         SET approval_status = ?, admin_notes = ?, approved_by = ?, approved_at = NOW(), payment_status = 'completed', updated_at = NOW()
         WHERE id = ?`,
        [newStatus, adminNotes || null, 'admin', registrationId]
      )
    } else {
      await query(
        `UPDATE vehicle_registrations 
         SET approval_status = ?, admin_notes = ?, approved_by = ?, approved_at = NOW(), updated_at = NOW()
         WHERE id = ?`,
        [newStatus, adminNotes || null, 'admin', registrationId]
      )
    }

    // Get registration details
    const result = await query(
      `SELECT owner_email, owner_name, vehicle_title, registration_number 
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

    // Send approval/rejection email
    if (action === 'approve') {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: registration.owner_email,
            subject: 'We have registered your vehicle',
            template: 'vehicle_registration_approved',
            data: {
              ownerName: registration.owner_name,
              vehicleTitle: registration.vehicle_title,
              registrationNumber: registration.registration_number,
            },
          }),
        })
      } catch (err) {
        console.error('Failed to send approval email:', err)
      }
    } else {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: registration.owner_email,
            subject: 'Vehicle Registration Update',
            template: 'vehicle_registration_rejected',
            data: {
              ownerName: registration.owner_name,
              vehicleTitle: registration.vehicle_title,
              adminNotes,
            },
          }),
        })
      } catch (err) {
        console.error('Failed to send rejection email:', err)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Vehicle registration ${action}ed successfully`,
    })
  } catch (error) {
    console.error('Error updating vehicle registration:', error)
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    )
  }
}
