"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Check, Trash2 } from 'lucide-react'
import { Review } from '@/lib/database'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { parseJsonSafe } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function AdminDashboard() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [pendingTab, setPendingTab] = useState(true)

  // Orders chart data and sales table
  const [orderStats, setOrderStats] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [salesLoading, setSalesLoading] = useState(false)
  const [startDate, setStartDate] = useState<string | undefined>(undefined)
  const [endDate, setEndDate] = useState<string | undefined>(undefined)
  const [currency, setCurrency] = useState<string | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)

  const fetchReviews = async (status = 'pending') => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/reviews?status=${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      let data
      try {
        data = await parseJsonSafe(response)
      } catch (err) {
        console.error('Failed to parse reviews response:', err)
        setReviews([])
        return
      }
      if (response.ok) {
        setReviews(data)
        if (status === 'pending') setPendingCount(data.length)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadOrderStats = async (days = 30) => {
    try {
      const token = localStorage.getItem('admin_token')
      console.log('[CLIENT] loadOrderStats: Fetching with days=', days)
      const res = await fetch(`/api/admin/orders/stats?days=${days}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      console.log('[CLIENT] loadOrderStats: Response status:', res.status)
      let data
      try {
        data = await parseJsonSafe(res)
      } catch (err) {
        console.error('[CLIENT] Failed to parse order stats response:', err)
        console.error('[CLIENT] Response status:', res.status)
        if (res.status === 401) {
          localStorage.removeItem('admin_token')
          window.location.href = '/admin/login'
          return
        }
        setOrderStats([])
        return
      }
      console.log('[CLIENT] loadOrderStats: Parsed data:', data)
      if (!res.ok || !data.success) {
        if (res.status === 401) {
          localStorage.removeItem('admin_token')
          window.location.href = '/admin/login'
          return
        }
        console.error('[CLIENT] Failed to load order stats', {
          error: data.error || 'Unknown error',
          details: data.details,
          stack: data.stack,
          status: res.status
        })
        setOrderStats([])
        return
      }
      console.log('[CLIENT] loadOrderStats: Setting stats with', data.stats?.length, 'records')
      setOrderStats(data.stats || [])
    } catch (err) {
      console.error('[CLIENT] Failed to load order stats', err instanceof Error ? err.message : String(err))
      console.error('[CLIENT] Full error:', err)
      setOrderStats([])
    }
  }

  const loadSales = async () => {
    try {
      setSalesLoading(true)
      const token = localStorage.getItem('admin_token')
      const params = new URLSearchParams()
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)
      if (statusFilter) params.set('status', statusFilter)
      if (currency) params.set('currency', currency)
      const res = await fetch(`/api/admin/sales?${params.toString()}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      let data
      try {
        data = await parseJsonSafe(res)
      } catch (err) {
        console.error('Failed to parse sales response:', err)
        setSales([])
        return
      }
      if (res.ok && data.success) {
        setSales(data.rows || [])
      }
    } catch (err) {
      console.error('Failed to load sales', err)
    } finally {
      setSalesLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews(pendingTab ? 'pending' : 'rejected')
    loadOrderStats()
    loadSales()
  }, [pendingTab])

  const handleApprove = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id, action: 'approve' }),
      })

      if (response.ok) {
        setReviews(reviews.filter((review) => review.id !== id))
        setPendingCount((prev) => Math.max(0, prev - 1))
        window.dispatchEvent(new Event('admin:counts:refresh'))
      }
    } catch (error) {
      console.error('Error approving review:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id, action: 'delete' }),
      })

      if (response.ok) {
        setReviews(reviews.filter((review) => review.id !== id))
        setPendingCount((prev) => Math.max(0, prev - 1))
        window.dispatchEvent(new Event('admin:counts:refresh'))
      }
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const handleReject = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id, action: 'reject' }),
      })

      if (response.ok) {
        // remove from pending list
        setReviews(reviews.filter((review) => review.id !== id))
        setPendingCount((prev) => Math.max(0, prev - 1))
        window.dispatchEvent(new Event('admin:counts:refresh'))
      }
    } catch (error) {
      console.error('Error rejecting review:', error)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'fill-[#b08a5a] text-[#b08a5a]' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  // Status badge for orders/sales
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#9EB8D3] text-[#7a5a33] border border-[#9EB8D3]">Pending</span>
      case 'processing':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">Processing</span>
      case 'completed':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">Completed</span>
      case 'cancelled':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">Cancelled</span>
      case 'refunded':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">Refunded</span>
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">{status}</span>
    }
  }

  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  const openReview = (r: Review) => setSelectedReview(r)
  const closeReview = () => setSelectedReview(null)

  return (
    <div className="px-4 md:px-6 py-4 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Reviews Management</h1>
        <p className="text-sm md:text-base text-gray-600">Review and approve customer feedback</p>
      </div>

      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 bg-white">
          <div className="flex items-center justify-between flex-col md:flex-row gap-2">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Orders (last 30 days)</h3>
              <p className="text-xs md:text-sm text-gray-600">Total orders by day</p>
            </div>
            <div className="text-xs md:text-sm text-gray-600">{orderStats.length} days</div>
          </div>

          <div className="mt-4 overflow-x-auto">
          <div className="min-w-full">
            <ChartContainer config={{ orders: { color: '#b08a5a' }, sales: { color: '#16a34a' } }} className="w-full h-64">
            <LineChart data={orderStats.map((d) => ({ date: d.day, count: Number(d.count), totalAmount: Number(d.totalAmount) }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#b08a5a" strokeWidth={2} dot={{ r: 3 }} yAxisId="left" />
              <Line type="monotone" dataKey="totalAmount" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} yAxisId="right" />
              </LineChart>
            </ChartContainer>
          </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-white">
          <div className="flex items-start md:items-center justify-between gap-2 mb-4 flex-col md:flex-row">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Sales</h3>
              <p className="text-xs md:text-sm text-gray-600">Recent sales and totals</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <div className="flex flex-col md:flex-row gap-2">
              <input type="date" value={startDate || ''} onChange={(e) => setStartDate(e.target.value || undefined)} className="border rounded-md p-2 text-xs md:text-sm flex-1" />
              <input type="date" value={endDate || ''} onChange={(e) => setEndDate(e.target.value || undefined)} className="border rounded-md p-2 text-xs md:text-sm flex-1" />
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <select value={statusFilter || ''} onChange={(e) => setStatusFilter(e.target.value || undefined)} className="border rounded-md p-2 text-xs md:text-sm flex-1">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
              <select value={currency || ''} onChange={(e) => setCurrency(e.target.value || undefined)} className="border rounded-md p-2 text-xs md:text-sm flex-1">
                <option value="">Any Currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <Button onClick={loadSales} className="h-10 text-xs md:text-sm">Filter</Button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-600">Order #</th>
                  <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-600 hidden sm:table-cell">Customer</th>
                  <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-600">Amount</th>
                  <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-600 hidden md:table-cell">Status</th>
                  <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-600 hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {salesLoading ? (
                  <tr><td colSpan={5} className="p-6 text-center">Loading...</td></tr>
                ) : sales.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 text-center text-gray-500">No sales</td></tr>
                ) : (
                  sales.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-2 md:px-4 py-3 text-xs md:text-sm">{s.order_number}</td>
                      <td className="px-2 md:px-4 py-3 text-xs md:text-sm hidden sm:table-cell">{s.customer_email}</td>
                      <td className="px-2 md:px-4 py-3 font-semibold text-xs md:text-sm">{s.currency} {Number(s.amount).toFixed(2)}</td>
                      <td className="px-2 md:px-4 py-3 text-xs md:text-sm hidden md:table-cell">{getStatusBadge(s.status)}</td>
                      <td className="px-2 md:px-4 py-3 text-xs md:text-sm hidden lg:table-cell">{new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : reviews.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <MessageSquare className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Reviews</h3>
          <p className="text-gray-600">All reviews have been processed</p>
        </Card>
      ) : (
        <div>
          <div className="mb-6 flex items-center justify-between flex-col md:flex-row gap-2">
            <div className="flex items-center gap-2 md:gap-3">
              <button
                className={`px-3 md:px-4 py-2 text-xs md:text-sm rounded ${/* @ts-ignore */ pendingTab ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setPendingTab(true)}
              >
                Pending
              </button>
              <button
                className={`px-3 md:px-4 py-2 text-xs md:text-sm rounded ${/* @ts-ignore */ !pendingTab ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setPendingTab(false)}
              >
                Rejected
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-xs md:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 md:px-4 py-3 text-left font-medium text-gray-600">Name</th>
                  <th className="px-2 md:px-4 py-3 text-left font-medium text-gray-600 hidden sm:table-cell">Email</th>
                  <th className="px-2 md:px-4 py-3 text-left font-medium text-gray-600">Rating</th>
                  <th className="px-2 md:px-4 py-3 text-left font-medium text-gray-600 hidden md:table-cell">Comment</th>
                  <th className="px-2 md:px-4 py-3 text-left font-medium text-gray-600 hidden lg:table-cell">Date</th>
                  <th className="px-2 md:px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-2 md:px-4 py-3 text-xs md:text-sm">{review.name}</td>
                    <td className="px-2 md:px-4 py-3 text-gray-600 text-xs md:text-sm hidden sm:table-cell">{review.email}</td>
                    <td className="px-2 md:px-4 py-3 text-xs md:text-sm">{renderStars(review.rating)}</td>
                    <td className="px-2 md:px-4 py-3 text-xs md:text-sm hidden md:table-cell">{review.comment.length > 120 ? review.comment.slice(0, 120) + '...' : review.comment}</td>
                    <td className="px-2 md:px-4 py-3 text-xs md:text-sm hidden lg:table-cell">{new Date(review.created_at).toLocaleDateString()}</td>
                    <td className="px-2 md:px-4 py-3">
                      <div className="flex gap-1 md:gap-2 flex-wrap">
                        {pendingTab ? (
                          <>
                            <Button onClick={() => handleApprove(review.id)} className="bg-green-600 hover:bg-green-700 text-white" size="sm"><Check className="w-3 md:w-4 h-3 md:h-4 mr-1" /><span className="hidden md:inline">Approve</span></Button>
                            <Button onClick={() => handleReject(review.id)} variant="outline" className="text-[#b08a5a] border-[#9EB8D3] hover:bg-[#D0E3F1]" size="sm"><span className="hidden md:inline">Reject</span></Button>
                          </>
                        ) : (
                          <Button onClick={() => handleDelete(review.id)} variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50" size="sm"><Trash2 className="w-3 md:w-4 h-3 md:h-4 mr-1" /><span className="hidden md:inline">Delete</span></Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  )
}
