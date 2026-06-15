import { NextResponse } from 'next/server';
import { insertReview, getAllReviews } from '@/lib/database';
import { sendEmail } from '@/app/api/send-email/route';

export async function GET() {
  try {
    const reviews = await getAllReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews';
    // In development, avoid returning 500 to prevent UI breakage; return empty list so Testimonials can render.
    if (process.env.NODE_ENV === 'development') {
      console.warn('[API][reviews] Returning empty list in development due to error:', errorMessage);
      return NextResponse.json([]);
    }

    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, rating, comment } = body;

    console.log('📝 Received review submission:', { name, email, rating, commentLength: comment?.length });

    // Validate required fields
    if (!name || !email || !rating || !comment) {
      console.warn('⚠️ Missing required fields:', { 
        hasName: !!name, 
        hasEmail: !!email, 
        hasRating: !!rating, 
        hasComment: !!comment 
      });
      return NextResponse.json(
        { error: 'Missing required fields: name, email, rating, and comment are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      console.warn('⚠️ Invalid rating:', rating);
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn('⚠️ Invalid email format:', email);
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed, inserting review into database...');
    const review = await insertReview({ name, email, rating, comment });
    console.log('✅ Review created successfully:', { id: review.id, status: review.status });

    // Send confirmation email to user
    try {
      const userConfirmationEmail = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3b82f6;">✅ Thank You for Your Review!</h2>
          <p>Hello ${name},</p>
          <p>We have successfully received your review submission. Thank you for taking the time to share your feedback with us!</p>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #b08a5a;">Your Review:</h3>
            <p style="margin: 8px 0;"><strong>Rating:</strong> ${'⭐'.repeat(rating)}</p>
            <p style="margin: 8px 0;"><strong>Your Comment:</strong></p>
            <p style="margin: 8px 0; color: #666; white-space: pre-wrap;">${comment}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ff9800; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>⏳ What Happens Next:</strong></p>
            <p style="margin: 8px 0 0 0; color: #856404;">Your review is currently pending approval. Our team will review it to ensure it meets our community guidelines before publishing it on our website.</p>
          </div>
          
          <p style="margin-top: 20px; color: #666; font-size: 14px;">We appreciate your valuable feedback and your support!</p>
          <p>Best Regards,<br/><strong>True Inspectify Team</strong></p>
        </div>
      `
      
      await sendEmail(
        email,
        'Thank You for Your Review! ⭐',
        userConfirmationEmail
      )
      console.log('📧 Confirmation email sent to reviewer:', email)
    } catch (userEmailError) {
      console.error('⚠️ Failed to send user confirmation email:', userEmailError)
      // Don't fail if user email fails
    }

    // Notify admin about new review (non-blocking)
    try {
      const adminNotificationEmail = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #b08a5a; border-radius: 10px; background: #eff6ff;">
          <h2 style="color: #b08a5a;">⭐ New Review Submission</h2>
          <p>A new review has been submitted and is pending approval.</p>
          
          <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #bfdbfe; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #b08a5a; border-bottom: 2px solid #b08a5a; padding-bottom: 10px;">Review Details:</h3>
            <p style="margin: 8px 0;"><strong>Reviewer Name:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0;"><strong>Rating:</strong> ${'⭐'.repeat(rating)} (${rating}/5)</p>
            <p style="margin: 8px 0;"><strong>Comment:</strong></p>
            <p style="margin: 8px 0; color: #666; white-space: pre-wrap; padding: 10px; background: #f9f9f9; border-radius: 4px;">${comment}</p>
          </div>
          
          <p style="margin-top: 20px; color: #b08a5a; font-weight: bold;">⚠️ Action Required:</p>
          <p style="margin: 8px 0; color: #666;">Please review this submission and approve or reject it in your admin dashboard.</p>
        </div>
      `

      const adminEmail = process.env.ADMIN_PAYMENT_EMAIL || 'vehiclehealthanalysis@gmail.com'
      await sendEmail(
        adminEmail,
        `⭐ New Review Submission - Pending Approval`,
        adminNotificationEmail
      )
      console.log('✅ Review notification email sent successfully')
    } catch (err) {
      console.error('⚠️ Failed to send review notification (non-blocking):', err)
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating review:', error);
    console.error('❌ Full error object:', JSON.stringify(error, null, 2));
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create review';
    let statusCode = 500;
    let errorCode = 'UNKNOWN_ERROR';
    
    if (error instanceof Error) {
      const errorStr = error.message.toLowerCase();
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      // Check for database connection errors
      if (errorStr.includes('econnrefused') || errorStr.includes('connect') || errorStr.includes('timeout')) {
        errorMessage = 'Database connection failed. Please try again in a moment.';
        statusCode = 503;
        errorCode = 'DB_CONNECTION_FAILED';
      } 
      // Check for table not found
      else if (errorStr.includes('no such table') || errorStr.includes('ER_NO_SUCH_TABLE') || errorStr.includes("doesn't exist")) {
        errorMessage = 'Review system is not properly configured. Please contact support.';
        statusCode = 503;
        errorCode = 'TABLE_NOT_FOUND';
      }
      // Check for other database errors
      else if (errorStr.includes('er_')) {
        errorMessage = 'Database error. Please try again or contact support.';
        statusCode = 500;
        errorCode = 'DATABASE_ERROR';
      }
      // Check for JSON parse errors
      else if (errorStr.includes('json')) {
        errorMessage = 'Invalid request format. Please try again.';
        statusCode = 400;
        errorCode = 'INVALID_JSON';
      }
      // Use the actual error message if available
      else {
        errorMessage = error.message || errorMessage;
        errorCode = 'API_ERROR';
      }
    }
    
    const errorResponse = { 
      error: errorMessage,
      errorCode,
      ...(process.env.NODE_ENV === 'development' && { details: String(error) })
    };
    
    console.error('❌ Returning error response:', errorResponse);
    
    return NextResponse.json(
      errorResponse,
      { status: statusCode }
    );
  }
}
