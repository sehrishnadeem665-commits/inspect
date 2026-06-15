"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { MessageSquare, Trash2 } from 'lucide-react'
import { parseJsonSafe } from '@/lib/utils'

type Contact = {
  id: number
  name: string
  email: string
  subject: string
  message: string
  status: string
  created_at: string
}

export default function AdminContactPage() {
  const [items, setItems] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [q, setQ] = useState<string | undefined>(undefined)
  const [startDate, setStartDate] = useState<string | undefined>(undefined)
  const [endDate, setEndDate] = useState<string | undefined>(undefined)

  const fetchContacts = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('admin_token')
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)
      const response = await fetch(`/api/admin/contact?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      let data
      try {
        data = await parseJsonSafe(response)
      } catch (err) {
        console.error('Failed to parse contacts response:', err)
        if (response.status === 401) {
          localStorage.removeItem('admin_token')
          window.location.href = '/admin/login'
          return
        }
        throw new Error('Failed to fetch (invalid response)')
      }
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('admin_token')
          window.location.href = '/admin/login'
          return
        }
        throw new Error(data.error || 'Failed to fetch')
      }
      setItems(data.submissions || [])
    } catch (err) {
      console.error('Error fetching contacts', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const handleMarkRead = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, action: 'mark_read' }),
      })
      if (res.ok) {
        setItems(items.map(i => (i.id === id ? { ...i, status: 'read' } : i)))
        // notify layout to refresh counters immediately
        window.dispatchEvent(new Event('admin:counts:refresh'))
      }
    } catch (err) {
      console.error('Failed to mark read', err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this message?')) return
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, action: 'delete' }),
      })
      if (res.ok) {
        setItems(items.filter(i => i.id !== id))
        window.dispatchEvent(new Event('admin:counts:refresh'))
      }
    } catch (err) {
      console.error('Failed to delete', err)
    }
  }

  const [selectedSubmission, setSelectedSubmission] = useState<Contact | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#9EB8D3] text-[#7a5a33] border border-[#9EB8D3]">New</span>
      case 'read':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">Read</span>
      case 'responded':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">Responded</span>
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">{status}</span>
    }
  }

  const handleMarkResponded = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, action: 'mark_responded' }),
      })
      if (res.ok) {
        const updated = await res.json()
        setItems(items.map(i => i.id === id ? updated.submission : i))
        window.dispatchEvent(new Event('admin:counts:refresh'))
        // close modal if open
        if (selectedSubmission?.id === id) setSelectedSubmission(updated.submission)
      }
    } catch (err) {
      console.error('Failed to mark responded', err)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Messages</h1>
          <p className="text-gray-600">Messages submitted from the Contact Us form</p>
        </div>
        <div className="flex gap-2">
          <a href="/admin/settings?section=contact" className="inline-block"><button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded">Settings</button></a>
        </div>
      </div>

      <Card className="p-4 overflow-x-auto">
        {isLoading ? (
          <div className="p-12 text-center">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No messages</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Message</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((it) => (
                <tr key={it.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{it.name}</td>
                  <td className="px-4 py-3 text-gray-600">{it.email}</td>
                  <td className="px-4 py-3">{it.subject}</td>
                  <td className="px-4 py-3">{it.message.length > 120 ? it.message.slice(0, 120) + '...' : it.message}</td>
                  <td className="px-4 py-3">{getStatusBadge(it.status)}</td>
                  <td className="px-4 py-3">{new Date(it.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(it)}>View</Button>
                      <Button variant="outline" size="sm" onClick={() => { if (confirm('Delete this message?')) handleDelete(it.id) }} className="text-amber-600 border-amber-200">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {selectedSubmission && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[80]" onClick={() => setSelectedSubmission(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[90] rounded-2xl shadow-2xl w-[95%] md:w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Message Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500">Name</label>
                  <p className="text-gray-900">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedSubmission.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">Subject</label>
                  <p className="text-gray-900">{selectedSubmission.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">Message</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedSubmission.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Created At</label>
                    <p className="text-gray-900">{new Date(selectedSubmission.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                {selectedSubmission.status !== 'read' && (
                  <Button onClick={() => { handleMarkRead(selectedSubmission.id); setSelectedSubmission(null) }} className="h-10">Mark Read</Button>
                )}
                {selectedSubmission.status !== 'responded' && (
                  <Button onClick={() => { handleMarkResponded(selectedSubmission.id); setSelectedSubmission(null) }} className="h-10">Mark Responded</Button>
                )}
                <Button variant="outline" onClick={() => setSelectedSubmission(null)}>Close</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
