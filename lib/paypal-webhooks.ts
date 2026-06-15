/**
 * PayPal Webhook Setup Guide
 * 
 * 1. Go to PayPal Developer Dashboard
 *    https://developer.paypal.com/dashboard/
 * 
 * 2. Navigate to Apps & Credentials
 *    - Select Sandbox (for testing)
 *    - Copy your Client ID
 * 
 * 3. Go to Webhooks section
 *    - Click "Create webhook"
 * 
 * 4. Webhook Configuration
 *    - Event receiver type: REST API
 *    - Webhook URL: https://yourdomain.com/api/paypal/webhook
 *    
 *    Example for development:
 *    - Use ngrok to expose local server: ngrok http 3000
 *    - Webhook URL: https://your-ngrok-url.ngrok.io/api/paypal/webhook
 * 
 * 5. Subscribe to these events:
 *    ✓ PAYMENT.CAPTURE.COMPLETED
 *    ✓ PAYMENT.CAPTURE.DENIED
 *    ✓ PAYMENT.CAPTURE.FAILED
 *    ✓ PAYMENT.CAPTURE.REFUNDED
 *    ✓ DISPUTE.CREATED
 *    ✓ DISPUTE.UPDATED
 *    ✓ CHECKOUT.ORDER.APPROVED
 *    ✓ CHECKOUT.ORDER.CREATED
 * 
 * 6. After creating webhook:
 *    - Copy the Webhook ID
 *    - Set in environment: PAYPAL_WEBHOOK_ID=xxxxx
 * 
 * 7. Test the webhook:
 *    - In PayPal Developer, use "Send test event"
 *    - Check your server logs
 *    - Verify database updates
 */

// PayPal Webhook Event Types
export const PAYPAL_EVENTS = {
  // Payment events
  PAYMENT_CAPTURE_COMPLETED: 'PAYMENT.CAPTURE.COMPLETED',
  PAYMENT_CAPTURE_DENIED: 'PAYMENT.CAPTURE.DENIED',
  PAYMENT_CAPTURE_FAILED: 'PAYMENT.CAPTURE.FAILED',
  PAYMENT_CAPTURE_REFUNDED: 'PAYMENT.CAPTURE.REFUNDED',
  
  // Order events
  CHECKOUT_ORDER_APPROVED: 'CHECKOUT.ORDER.APPROVED',
  CHECKOUT_ORDER_CREATED: 'CHECKOUT.ORDER.CREATED',
  
  // Dispute events
  DISPUTE_CREATED: 'DISPUTE.CREATED',
  DISPUTE_UPDATED: 'DISPUTE.UPDATED',
}

// Payment Status Mapping
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  DISPUTE: 'dispute',
}

// Status to Color Mapping for Admin Dashboard
export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',     // ⏳ Yellow
  approved: 'bg-amber-100 text-amber-800',        // ✓ Blue
  completed: 'bg-green-100 text-green-800',     // ✅ Green
  failed: 'bg-amber-100 text-amber-800',            // ❌ Red
  refunded: 'bg-gray-100 text-gray-800',        // 🔄 Gray
  dispute: 'bg-orange-100 text-orange-800',     // ⚠️ Orange
}

// Status to Icon Mapping
export const STATUS_ICONS = {
  pending: '⏳',
  approved: '✓',
  completed: '✅',
  failed: '❌',
  refunded: '🔄',
  dispute: '⚠️',
}

/**
 * Example webhook event payload from PayPal
 * 
 * PAYMENT.CAPTURE.COMPLETED:
 * {
 *   "event_type": "PAYMENT.CAPTURE.COMPLETED",
 *   "event_id": "WH-123456789",
 *   "create_time": "2024-05-02T10:30:00Z",
 *   "resource": {
 *     "id": "9A123456789",
 *     "status": "COMPLETED",
 *     "amount": {
 *       "value": "29.99",
 *       "currency_code": "USD"
 *     },
 *     "supplementary_data": {
 *       "related_ids": {
 *         "order_id": "ORD-12345"
 *       }
 *     }
 *   }
 * }
 */
