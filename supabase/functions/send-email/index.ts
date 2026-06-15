import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_EMAIL = "sehrishnadeem39@gmail.com";

interface OrderEmailData {
  type: "order_notification" | "order_confirmation";
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  vehicleType: string;
  identificationType: string;
  identificationValue: string;
  packageType: string;
  amount: number;
  currency: string;
  // Optional payment status (pending, completed, failed)
  paymentStatus?: string;
}

interface ContactEmailData {
  type: "contact_form";
  name: string;
  email: string;
  subject: string;
  message: string;
}

type EmailData = OrderEmailData | ContactEmailData;

function generateOrderNotificationEmail(data: OrderEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .label { font-weight: bold; width: 180px; color: #4b5563; }
    .value { color: #111827; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 New Order Received!</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-bottom: 20px;">A new order has been placed. Here are the details:</p>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <div class="info-row">
          <div class="label">Order Number:</div>
          <div class="value">${data.orderNumber}</div>
        </div>
        <div class="info-row">
          <div class="label">Customer Email:</div>
          <div class="value">${data.customerEmail}</div>
        </div>
        <div class="info-row">
          <div class="label">Vehicle Type:</div>
          <div class="value">${data.vehicleType}</div>
        </div>
        <div class="info-row">
          <div class="label">Identification Type:</div>
          <div class="value">${data.identificationType.toUpperCase()}</div>
        </div>
        <div class="info-row">
          <div class="label">Identification Value:</div>
          <div class="value">${data.identificationValue}</div>
        </div>
        <div class="info-row">
          <div class="label">Package:</div>
          <div class="value">${data.packageType.charAt(0).toUpperCase() + data.packageType.slice(1)}</div>
        </div>
        <div class="info-row">
          <div class="label">Payment Status:</div>
          <div class="value">${data.paymentStatus ? data.paymentStatus.charAt(0).toUpperCase() + data.paymentStatus.slice(1) : 'Pending'}</div>
        </div>
        <div class="info-row" style="border-bottom: none;">
          <div class="label">Amount:</div>
          <div class="value" style="font-size: 18px; font-weight: bold; color: #2563eb;">${data.currency} ${data.amount.toFixed(2)}</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>This is an automated notification from your vehicle history report system.</p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateOrderConfirmationEmail(data: OrderEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .success-badge { background: #10b981; color: white; display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 20px 0; }
    .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .label { font-weight: bold; width: 180px; color: #4b5563; }
    .value { color: #111827; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Order Confirmed!</h1>
    </div>
    <div class="content">
      <div style="text-align: center;">
        <span class="success-badge">Payment Successful</span>
      </div>
      
      <p style="font-size: 16px; margin-bottom: 20px;">Thank you for your order! Your vehicle history report is being prepared.</p>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0; color: #2563eb;">Order Details</h2>
        <div class="info-row">
          <div class="label">Order Number:</div>
          <div class="value">${data.orderNumber}</div>
        </div>
        <div class="info-row">
          <div class="label">Product:</div>
          <div class="value">${data.packageType.charAt(0).toUpperCase() + data.packageType.slice(1)} Report</div>
        </div>
        <div class="info-row">
          <div class="label">Vehicle Type:</div>
          <div class="value">${data.vehicleType}</div>
        </div>
        <div class="info-row">
          <div class="label">${data.identificationType.toUpperCase()}:</div>
          <div class="value">${data.identificationValue}</div>
        </div>
        <div class="info-row" style="border-bottom: none;">
          <div class="label">Amount Paid:</div>
          <div class="value" style="font-size: 18px; font-weight: bold; color: #2563eb;">${data.currency} ${data.amount.toFixed(2)}</div>
        </div>
      </div>
      
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; color: #92400e;"><strong>What's Next?</strong></p>
        <p style="margin: 8px 0 0 0; color: #92400e;">You will receive your vehicle history report within 1-3 hours via email.</p>
      </div>
    </div>
    <div class="footer">
      <p>Thank you for choosing our service!</p>
      <p style="margin-top: 10px;">If you have any questions, please don't hesitate to contact us.</p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateContactFormEmail(data: ContactEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-row { padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .label { font-weight: bold; color: #4b5563; margin-bottom: 8px; }
    .value { color: #111827; }
    .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 New Contact Form Submission</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-bottom: 20px;">You have received a new message from your contact form:</p>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <div class="info-row">
          <div class="label">Name:</div>
          <div class="value">${data.name}</div>
        </div>
        <div class="info-row">
          <div class="label">Email:</div>
          <div class="value">${data.email}</div>
        </div>
        <div class="info-row" style="border-bottom: none;">
          <div class="label">Subject:</div>
          <div class="value">${data.subject}</div>
        </div>
      </div>
      
      <div class="message-box">
        <div class="label">Message:</div>
        <div class="value" style="white-space: pre-wrap;">${data.message}</div>
      </div>
    </div>
    <div class="footer">
      <p>This is an automated notification from your contact form.</p>
    </div>
  </div>
</body>
</html>
  `;
}

async function sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured. Email would be sent to:", to);
      console.log("Subject:", subject);
      console.log("Content:", htmlContent.substring(0, 200) + "...");
      return true;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Vehicle Reports <noreply@yourdomain.com>",
        to: [to],
        subject: subject,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to send email:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data: EmailData = await req.json();

    if (data.type === "order_notification") {
      const htmlContent = generateOrderNotificationEmail(data);
      const success = await sendEmail(
        ADMIN_EMAIL,
        `New Order: ${data.orderNumber}`,
        htmlContent
      );

      return new Response(
        JSON.stringify({ success, message: success ? "Order notification sent" : "Failed to send notification" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (data.type === "order_confirmation") {
      const htmlContent = generateOrderConfirmationEmail(data);
      const success = await sendEmail(
        data.customerEmail,
        `Order Confirmation - ${data.orderNumber}`,
        htmlContent
      );

      return new Response(
        JSON.stringify({ success, message: success ? "Order confirmation sent" : "Failed to send confirmation" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (data.type === "contact_form") {
      const htmlContent = generateContactFormEmail(data);
      const success = await sendEmail(
        ADMIN_EMAIL,
        `Contact Form: ${data.subject}`,
        htmlContent
      );

      return new Response(
        JSON.stringify({ success, message: success ? "Contact form notification sent" : "Failed to send notification" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Invalid email type" }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});