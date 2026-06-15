'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'

interface Payment {
  id: number
  order_id: string
  paypal_order_id: string
  transaction_id: string
  customer_email: string
  customer_name: string
  amount: number
  currency: string
  payment_status: string
  payment_method: string
  webhook_event: string
  created_at: string
  updated_at: string
}

interface PaymentSummary {
  pending: number
  approved: number
  completed: number
  failed: number
  refunded: number
  dispute: number
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    icon: '⏳',
    color: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-800',
  },
  approved: {
    label: 'Approved',
    icon: '✓',
    color: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-800',
  },
  completed: {
    label: 'Completed',
    icon: '✅',
    color: 'bg-green-50 border-green-200',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-800',
  },
  failed: {
    label: 'Failed',
    icon: '❌',
    color: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-800',
  },
  refunded: {
    label: 'Refunded',
    icon: '🔄',
    color: 'bg-gray-50 border-gray-200',
    text: 'text-gray-700',
    badge: 'bg-gray-100 text-gray-800',
  },
  dispute: {
    label: 'Dispute',
    icon: '⚠️',
    color: 'bg-orange-50 border-orange-200',
    text: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-800',
  },
}

export default function PaymentStatusDashboard() {
  const [payments, setPayments] = useState<{ [key: string]: Payment[] }>({})
  const [summary, setSummary] = useState<PaymentSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdate, setLastUpdate] = useState<string>('')

  const fetchPaymentStatuses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/payment-status')
      const data = await response.json()

      if (data.success) {
        setPayments(data.payments)
        setSummary(data.summary)
        setLastUpdate(new Date().toLocaleTimeString())
        setError('')
      } else {
        setError('Failed to fetch payment statuses')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentStatuses()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPaymentStatuses, 30000)
    return () => clearInterval(interval)
  }, [])

  const renderStatusSummary = () => {
    if (!summary) return null

    const statuses = [
      { key: 'pending', count: summary.pending },
      { key: 'approved', count: summary.approved },
      { key: 'completed', count: summary.completed },
      { key: 'failed', count: summary.failed },
      { key: 'refunded', count: summary.refunded },
      { key: 'dispute', count: summary.dispute },
    ]

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {statuses.map(({ key, count }) => {
          const config = STATUS_CONFIG[key as keyof typeof STATUS_CONFIG]
          return (
            <div
              key={key}
              className={`p-3 rounded-lg border ${config.color}`}
            >
              <div className="text-2xl mb-1">{config.icon}</div>
              <div className={`text-sm font-semibold ${config.text}`}>
                {config.label}
              </div>
              <div className="text-2xl font-bold mt-1">{count}</div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderPaymentsList = () => {
    if (!payments || Object.keys(payments).length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle className="mx-auto mb-3 text-gray-400" size={48} />
          <p>No payments found</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {Object.entries(payments).map(([status, paymentList]) => {
          if (paymentList.length === 0) return null
          const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]

          return (
            <div key={status} className="border rounded-lg overflow-hidden">
              <div className={`${config.color} p-4 border-b`}>
                <h3 className={`text-lg font-bold ${config.text}`}>
                  {config.icon} {config.label} ({paymentList.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left">Order ID</th>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-left">Method</th>
                      <th className="px-4 py-2 text-left">Event</th>
                      <th className="px-4 py-2 text-left">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentList.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {payment.order_id}
                          </code>
                        </td>
                        <td className="px-4 py-2">
                          <div className="text-sm font-medium">
                            {payment.customer_name || payment.customer_email}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.customer_email}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {payment.currency} {payment.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-2">
                          <span className="capitalize text-xs font-medium">
                            {payment.payment_method}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {payment.webhook_event || 'N/A'}
                          </code>
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-600">
                          {new Date(payment.updated_at).toLocaleDateString()} at{' '}
                          {new Date(payment.updated_at).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Status Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time payment updates via PayPal Webhooks
          </p>
        </div>
        <button
          onClick={fetchPaymentStatuses}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-amber-800">Error</h3>
            <p className="text-amber-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Last Update */}
      {lastUpdate && (
        <div className="text-xs text-gray-500 mb-4">
          Last updated: {lastUpdate}
        </div>
      )}

      {/* Summary Cards */}
      {!loading && renderStatusSummary()}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="animate-spin mx-auto mb-3 text-amber-600" size={32} />
            <p className="text-gray-600">Loading payment statuses...</p>
          </div>
        </div>
      )}

      {/* Payments List */}
      {!loading && renderPaymentsList()}
    </div>
  )
}
