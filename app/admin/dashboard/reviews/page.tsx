"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Check, Trash2 } from 'lucide-react'
import { Review } from '@/lib/database'
import { parseJsonSafe } from '@/lib/utils'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [pendingTab, setPendingTab] = useState(true)

  const [minRating, setMinRating] = useState<number | undefined>(undefined)
  const [startDate, setStartDate] = useState<string | undefined>(undefined)
  const [endDate, setEndDate] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState<string>('')

  const fetchReviews = async (status = 'pending') => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('admin_token')
      const params = new URLSearchParams()
      if (status) params.set('status', status)
      if (minRating) params.set('minRating', String(minRating))
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)
      if (search) params.set('search', search)
      const response = await fetch(`/api/admin/reviews?${params.toString()}`, {
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

  useEffect(() => {
    fetchReviews(pendingTab ? 'pending' : 'rejected')
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

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews Management</h1>
          <p className="text-gray-600">Review and approve customer feedback</p>
        </div>
        <div className="flex gap-2">
          <a href="/admin/settings?section=reviews" className="inline-block"><button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded">Settings</button></a>
        </div>
      </div>

      <div className="mb-6">
        <Card className="p-6 bg-amber-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pending Reviews</h3>
              <p className="text-sm text-gray-600">Reviews waiting for approval</p>
            </div>
            <div className="text-4xl font-bold text-amber-600">{pendingCount}</div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input placeholder="Search name, email or comment" value={search} onChange={(e) => setSearch(e.target.value)} className="border rounded p-2" />
            <select value={minRating || ''} onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : undefined)} className="border rounded p-2">
              <option value="">Any rating</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            <input type="date" value={startDate || ''} onChange={(e) => setStartDate(e.target.value || undefined)} className="border rounded p-2" />
            <div className="flex gap-2">
              <Button onClick={() => fetchReviews(pendingTab ? 'pending' : 'rejected')} className="h-10">Filter</Button>
            </div>
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
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Reviews</h3>
          <p className="text-gray-600">All reviews have been processed</p>
        </Card>
      ) : (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className={`px-4 py-2 rounded ${/* @ts-ignore */ pendingTab ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setPendingTab(true)}
              >
                Pending
              </button>
              <button
                className={`px-4 py-2 rounded ${/* @ts-ignore */ !pendingTab ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setPendingTab(false)}
              >
                Rejected
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Rating</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Comment</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{review.name}</td>
                    <td className="px-4 py-3 text-gray-600">{review.email}</td>
                    <td className="px-4 py-3">{renderStars(review.rating)}</td>
                    <td className="px-4 py-3">{review.comment.length > 120 ? review.comment.slice(0, 120) + '...' : review.comment}</td>
                    <td className="px-4 py-3">{new Date(review.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {pendingTab ? (
                          <>
                            <Button onClick={() => handleApprove(review.id)} className="bg-green-600 hover:bg-green-700 text-white" size="sm"><Check className="w-4 h-4 mr-2" />Approve</Button>
                            <Button onClick={() => handleReject(review.id)} variant="outline" className="text-[#b08a5a] border-[#9EB8D3] hover:bg-[#D0E3F1]" size="sm">Reject</Button>
                            <Button onClick={() => handleDelete(review.id)} variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50" size="sm"><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
                          </>
                        ) : (
                          <Button onClick={() => handleDelete(review.id)} variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50" size="sm"><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
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
