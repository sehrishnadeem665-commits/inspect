"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Eye, Mail, X as XIcon } from 'lucide-react'
import { parseJsonSafe } from '@/lib/utils'

interface VehicleRegistration {
  id: number
  registration_number: string
  owner_name: string
  owner_email: string
  vehicle_title: string
  vehicle_year: number
  vehicle_make: string
  vehicle_model: string
  vehicle_type: string
  vin: string
  license_plate: string
  description: string
  price: number
  currency: string
  payment_status: 'pending' | 'completed' | 'failed'
  approval_status: 'pending' | 'approved' | 'rejected'
  created_at: string
  approved_at: string | null
}

export default function VehicleRegistrationsPage() {
  const [registrations, setRegistrations] = useState<VehicleRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReg, setSelectedReg] = useState<VehicleRegistration | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [filterTab, setFilterTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')

  const fetchRegistrations = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/vehicle-registrations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem('admin_token')
        window.location.href = '/admin/login'
        return
      }

      let data
      try {
        data = await parseJsonSafe(response)
      } catch (err) {
        console.error('Failed to parse response:', err)
        setRegistrations([])
        return
      }

      if (response.ok && data.success) {
        setRegistrations(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const handleApprove = async (registrationId: number) => {
    try {
      setIsProcessing(true)
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/vehicle-registrations', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId,
          action: 'approve',
          adminNotes: 'Approved by admin',
        }),
      })

      let data
      try {
        data = await parseJsonSafe(response)
      } catch (err) {
        console.error('Failed to parse response:', err)
        return
      }

      if (response.ok && data.success) {
        // Refresh the list and close modal
        await fetchRegistrations()
        setSelectedReg(null)
        window.dispatchEvent(new Event('admin:counts:refresh'))
      } else {
        alert(data?.error || 'Failed to approve registration')
      }
    } catch (error) {
      console.error('Error approving registration:', error)
      alert('Failed to approve registration')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (registrationId: number) => {
    try {
      setIsProcessing(true)
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/vehicle-registrations', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId,
          action: 'reject',
          adminNotes: 'Rejected by admin',
        }),
      })

      let data
      try {
        data = await parseJsonSafe(response)
      } catch (err) {
        console.error('Failed to parse response:', err)
        return
      }

      if (response.ok && data.success) {
        // Refresh the list and close modal
        await fetchRegistrations()
        setSelectedReg(null)
        window.dispatchEvent(new Event('admin:counts:refresh'))
      } else {
        alert(data?.error || 'Failed to reject registration')
      }
    } catch (error) {
      console.error('Error rejecting registration:', error)
      alert('Failed to reject registration')
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredRegistrations = registrations.filter(reg => {
    if (filterTab === 'all') return true
    return reg.approval_status === filterTab
  })

  const pendingCount = registrations.filter(r => r.approval_status === 'pending').length
  const approvedCount = registrations.filter(r => r.approval_status === 'approved').length
  const rejectedCount = registrations.filter(r => r.approval_status === 'rejected').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Registrations</h1>
        <p className="text-gray-600">Manage vehicle registration requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-2xl font-bold text-[#b08a5a]">{pendingCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Approved</div>
          <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Rejected</div>
          <div className="text-2xl font-bold text-amber-600">{rejectedCount}</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['pending', 'approved', 'rejected', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              filterTab === tab
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading ? (
        <Card className="p-8 text-center text-gray-500">
          <p>Loading registrations...</p>
        </Card>
      ) : filteredRegistrations.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          <p>No registrations found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredRegistrations.map(reg => (
            <Card
              key={reg.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedReg(reg)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {reg.vehicle_year} {reg.vehicle_make} {reg.vehicle_model}
                    </h3>
                    <Badge
                      variant={
                        reg.approval_status === 'approved'
                          ? 'default'
                          : reg.approval_status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {reg.approval_status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <p>Owner: {reg.owner_name} ({reg.owner_email})</p>
                    <p>Reg #: {reg.registration_number}</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">{reg.currency} {reg.price}</span>
                    <span className="text-gray-600 ml-4">
                      Listed on {new Date(reg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setSelectedReg(reg)
                  }}
                  className="px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-colors"
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  View
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">Registration Details</h2>
              <button
                onClick={() => setSelectedReg(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                 <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Vehicle Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Title</label>
                    <p className="text-gray-900">{selectedReg.vehicle_title}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Type</label>
                    <p className="text-gray-900">{selectedReg.vehicle_type}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Make</label>
                    <p className="text-gray-900">{selectedReg.vehicle_make}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Model</label>
                    <p className="text-gray-900">{selectedReg.vehicle_model}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Year</label>
                    <p className="text-gray-900">{selectedReg.vehicle_year}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Price</label>
                    <p className="text-gray-900">{selectedReg.currency} {selectedReg.price}</p>
                  </div>
                  {selectedReg.vin && (
                    <div>
                      <label className="text-xs font-medium text-gray-600">VIN</label>
                      <p className="text-gray-900 font-mono text-sm">{selectedReg.vin}</p>
                    </div>
                  )}
                  {selectedReg.license_plate && (
                    <div>
                      <label className="text-xs font-medium text-gray-600">License Plate</label>
                      <p className="text-gray-900 font-mono text-sm">{selectedReg.license_plate}</p>
                    </div>
                  )}
                </div>
                {selectedReg.description && (
                  <div className="mt-4">
                    <label className="text-xs font-medium text-gray-600">Description</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedReg.description}</p>
                  </div>
                )}
              </div>

              {/* Owner Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Owner Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Name</label>
                    <p className="text-gray-900">{selectedReg.owner_name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{selectedReg.owner_email}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Approval Status</label>
                    <Badge
                      variant={
                        selectedReg.approval_status === 'approved'
                          ? 'default'
                          : selectedReg.approval_status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {selectedReg.approval_status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Payment Status</label>
                    <Badge
                      variant={
                        selectedReg.payment_status === 'completed'
                          ? 'default'
                          : selectedReg.payment_status === 'failed'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {selectedReg.payment_status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-600">
                  <p>Registration #: {selectedReg.registration_number}</p>
                  <p>Created: {new Date(selectedReg.created_at).toLocaleString()}</p>
                  {selectedReg.approved_at && (
                    <p>Approved: {new Date(selectedReg.approved_at).toLocaleString()}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedReg.approval_status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleApprove(selectedReg.id)}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedReg.id)}
                    disabled={isProcessing}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Reject'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
