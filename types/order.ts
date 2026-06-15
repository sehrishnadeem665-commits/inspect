export type Order = {
  id: number
  order_number: string
  customer_email: string
  vehicle_type: string
  identification_type: string
  identification_value: string
  vin_number?: string | null
  package_type: string
  country_code: string
  state?: string | null
  currency: string
  amount: number
  payment_status: 'pending' | 'completed' | 'failed'
  payment_provider?: string | null
  payment_id?: string | null
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  report_url?: string | null
  created_at: string
  updated_at: string
  completed_at?: string | null
}
