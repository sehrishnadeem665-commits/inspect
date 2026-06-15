import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/app/api/send-email/route'
import pool from '@/lib/mysql'

const ADMIN_EMAIL = process.env.ADMIN_PAYMENT_EMAIL || 'vehiclehealthanalysis@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerPhone,
      customerEmail,
      vehicleIdentifier,
      vehicleType,
      packageId,
      amount,
      currency,
    } = body

    // Validate required fields
    if (!customerEmail || !vehicleIdentifier || !vehicleType || !packageId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Map package ID to name
    const packageNames = {
      basic: 'Basic Report',
      standard: 'Standard Report',
      premium: 'Premium Report',
    }

    const packageName = packageNames[packageId as keyof typeof packageNames] || packageId

    // Generate HTML email for customer confirmation
    const customerEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #3b82f6;">✅ Payment Successful - Report Received!</h2>
        <p>Hello,</p>
        <p>Thank you! Your payment has been successfully processed and your report request is now confirmed.</p>
        
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #b08a5a;">Order Confirmed:</h3>
          <p style="margin: 8px 0;"><strong>Vehicle Type:</strong> ${vehicleType}</p>
          <p style="margin: 8px 0;"><strong>VIN / License Plate:</strong> ${vehicleIdentifier}</p>
          <p style="margin: 8px 0;"><strong>Package:</strong> ${packageName}</p>
          <p style="margin: 8px 0;"><strong>Amount:</strong> ${currency} ${Number(amount).toFixed(2)}</p>
        </div>
        
        <div style="background: #d1fae5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
          <p style="margin: 0; color: #065f46;"><strong>⏳ Report Generation:</strong></p>
          <p style="margin: 8px 0 0 0; color: #065f46;">Your comprehensive vehicle history report will be ready in approximately 12-13 hours. We will send you another email with your report details.</p>
        </div>
        
        <p style="margin-top: 20px; color: #666; font-size: 14px;">Thank you for using True Inspectify!</p>
        <p>Best Regards,<br/><strong>True Inspectify Team</strong></p>
      </div>
    `

    // Generate HTML email for admin - ONLY AT FORM SUBMISSION (not payment)
    const adminFormNotificationHtml = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #b08a5a; border-radius: 10px; background: #eff6ff;">
        <h2 style="color: #b08a5a;">🆕 New Report Request Form Submitted</h2>
        <p>A new report request has been submitted. Awaiting payment from customer.</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #bfdbfe; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #b08a5a; border-bottom: 2px solid #b08a5a; padding-bottom: 10px;">Entry Details:</h3>
          <p style="margin: 8px 0;"><strong>Full Name:</strong> ${customerName || 'Not provided'}</p>
          <p style="margin: 8px 0;"><strong>Phone Number:</strong> ${customerPhone || 'Not provided'}</p>
          <p style="margin: 8px 0;"><strong>Customer Email:</strong> ${customerEmail}</p>
          <p style="margin: 8px 0;"><strong>Vehicle Type:</strong> ${vehicleType}</p>
          <p style="margin: 8px 0;"><strong>VIN / License Plate:</strong> ${vehicleIdentifier}</p>
          <p style="margin: 8px 0;"><strong>Package:</strong> ${packageName}</p>
          <p style="margin: 8px 0;"><strong>Amount:</strong> ${currency} ${Number(amount).toFixed(2)}</p>
          <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">⏳ AWAITING PAYMENT</span></p>
        </div>
        
        <p style="margin-top: 20px; color: #b08a5a; font-weight: bold;">⚠️ Next Steps:</p>
        <p style="margin: 8px 0; color: #666;">Customer will proceed to payment. You will receive a payment confirmation once they complete the transaction.</p>
      </div>
    `

    // Send notification to admin ONLY at form submission
    try {
      await sendEmail(
        ADMIN_EMAIL,
        `🆕 New Report Request - Awaiting Payment`,
        adminFormNotificationHtml
      )
      console.log('📧 Admin notification sent (form submission):', ADMIN_EMAIL)
    } catch (emailError) {
      console.warn('⚠️ Failed to send admin notification email:', emailError)
      // Continue even if email fails
    }

    // Save submission to database (optional, for record keeping)
    try {
      await pool.query(
        `INSERT INTO report_submissions (
          customer_name, customer_phone, customer_email, vehicle_identifier, vehicle_type,
          package_id, amount, currency, submitted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [customerName || null, customerPhone || null, customerEmail, vehicleIdentifier, vehicleType, packageId, amount, currency]
      )
      console.log('✅ Submission saved to database')
    } catch (dbError) {
      console.warn('⚠️ Failed to save submission to database:', dbError)
      // Continue even if DB save fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Report request submitted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error processing report submission:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    )
  }
}
