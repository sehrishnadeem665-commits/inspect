// PayPal API Helper Functions
const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'production'
  ? 'https://api.paypal.com'
  : 'https://api.sandbox.paypal.com'

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
const PAYPAL_SECRET = process.env.PAYPAL_SECRET_KEY

if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
  console.warn('⚠️ PayPal credentials not configured in .env.local')
}

/**
 * Get PayPal Access Token
 */
export async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64')
  
  try {
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    if (!response.ok) {
      let errorDetails = ''
      try {
        const errorData = await response.json()
        errorDetails = JSON.stringify(errorData)
      } catch {
        errorDetails = response.statusText
      }
      console.error('❌ PayPal Auth Error:', {
        status: response.status,
        statusText: response.statusText,
        details: errorDetails,
      })
      throw new Error(`Failed to get PayPal access token: ${response.status} - ${errorDetails}`)
    }

    const data = await response.json()
    if (!data.access_token) {
      throw new Error('No access token returned from PayPal')
    }
    return data.access_token
  } catch (error) {
    console.error('❌ Error getting PayPal access token:', error)
    throw error
  }
}

/**
 * Create PayPal Order
 */
export interface CreateOrderParams {
  amount: number
  currency: string
  description: string
  customerEmail: string
  orderId: string // Your internal order ID
  packageName: string
}

export async function createPayPalOrder(params: CreateOrderParams) {
  try {
    console.log('📝 Creating PayPal order with params:', {
      amount: params.amount,
      currency: params.currency,
      packageName: params.packageName,
      customerEmail: params.customerEmail,
    })

    const accessToken = await getPayPalAccessToken()
    console.log('✅ Got PayPal access token')

    const orderBody = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: params.orderId,
          amount: {
            currency_code: params.currency,
            value: params.amount.toString(),
          },
          description: `${params.packageName} Report - Vehicle VIN/Plate`,
          payee: {
            email_address: process.env.ADMIN_PAYMENT_EMAIL,
            merchant_id: process.env.PAYPAL_MERCHANT_ID,
          },
        },
      ],
      payer: {
        email_address: params.customerEmail,
      },
      application_context: {
        brand_name: 'True Inspectify',
        locale: 'en-US',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?orderId=${params.orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel`,
      },
    }

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderBody),
    })

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: response.statusText }
      }
      console.error('❌ PayPal Order Creation Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        requestBody: orderBody,
      })
      throw new Error(`PayPal API Error (${response.status}): ${errorData.message || errorData.error_description || response.statusText}`)
    }

    const result = await response.json()
    console.log('✅ PayPal order created:', result.id)
    return result
  } catch (error) {
    console.error('❌ Failed to create PayPal order:', error)
    throw error
  }
}

/**
 * Capture PayPal Order
 */
export async function capturePayPalOrder(orderId: string) {
  try {
    console.log('📝 Capturing PayPal order:', orderId)
    
    const accessToken = await getPayPalAccessToken()

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: response.statusText }
      }
      console.error('❌ PayPal Capture Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        orderId,
      })
      throw new Error(`PayPal API Error (${response.status}): ${errorData.message || errorData.error_description || response.statusText}`)
    }

    const result = await response.json()
    console.log('✅ PayPal order captured:', result.id)
    return result
  } catch (error) {
    console.error('❌ Failed to capture PayPal order:', error)
    throw error
  }
}

/**
 * Verify PayPal Order Status
 */
export async function getPayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken()

  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get PayPal order: ${response.statusText}`)
  }

  return await response.json()
}
