import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import countriesList from '@/lib/countries'
import { getStatesForCountry } from '@/lib/countryStates'
import { Button } from '@/components/ui/button'
import { Order } from '@/types/order'

export default function EditOrderForm({ order, onClose, onUpdated }: { order: Order; onClose: () => void; onUpdated: (order: Order) => void }) {
  const [form, setForm] = useState(() => ({
    customer_email: order.customer_email || '',
    vehicle_type: order.vehicle_type || '',
    vin_number: order.vin_number || '',
    package_type: order.package_type || '',
    country_code: order.country_code || 'US',
    state: order.state || '',
    currency: order.currency || 'USD',
    amount: String(order.amount || ''),
    payment_status: order.payment_status || 'pending',
    status: order.status || 'pending',
    report_url: order.report_url || '',
  }))
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setForm({
      customer_email: order.customer_email || '',
      vehicle_type: order.vehicle_type || '',
      vin_number: order.vin_number || '',
      package_type: order.package_type || '',
      country_code: order.country_code || 'US',
      state: order.state || '',
      currency: order.currency || 'USD',
      amount: String(order.amount || ''),
      payment_status: order.payment_status || 'pending',
      status: order.status || 'pending',
      report_url: order.report_url || '',
    })
  }, [order])

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((s) => ({ ...s, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const token = localStorage.getItem('admin_token')
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
    headers['Content-Type'] = 'application/json'

    try {
      // Build payload for PATCH (allowed fields)
      const payload: any = {
        customer_email: form.customer_email,
        vehicle_type: form.vehicle_type,
        package_type: form.package_type,
        vin_number: form.vin_number || null,
        country_code: form.country_code,
        state: form.state || null,
        currency: form.currency,
        amount: Number(form.amount) || 0,
        report_url: form.report_url || null,
        payment_status: form.payment_status as any,
      }

      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
      })
      const patched = await res.json().catch(() => null)
      if (!res.ok || patched?.success === false) {
        const errMsg = patched?.error || 'Failed to update order'
        import('@/hooks/use-toast').then(mod => mod.toast({ title: 'Update failed', description: String(errMsg), variant: 'destructive' }))
        setIsSaving(false)
        return
      }

      let updatedOrder = patched.order || null

      // If report status changed, call the status endpoint
      if (form.status !== order.status) {
        const sresp = await fetch(`/api/admin/orders/${order.id}/status`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ reportStatus: form.status, reportUrl: form.report_url || undefined }),
        })
        const sjson = await sresp.json().catch(() => null)
        if (sresp.ok && sjson?.success) {
          updatedOrder = sjson.order
        } else {
          // status update failed - show toast but continue
          import('@/hooks/use-toast').then(mod => mod.toast({ title: 'Status update failed', description: sjson?.error || 'Failed to update status', variant: 'destructive' }))
        }
      }

      // If we didn't get an updatedOrder from status update, use patched response
      if (!updatedOrder && patched && patched.order) {
        updatedOrder = patched.order
      }

      if (updatedOrder) {
        onUpdated(updatedOrder)
      } else {
        // Fallback: reload page list
        onClose()
        import('@/hooks/use-toast').then(mod => mod.toast({ title: 'Order updated', description: 'Order update completed.' }))
      }

    } catch (err: any) {
      console.error('Failed to save order:', err)
      import('@/hooks/use-toast').then(mod => mod.toast({ title: 'Update failed', description: String(err?.message || err), variant: 'destructive' }))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-500">Email</label>
          <Input value={form.customer_email} onChange={(e) => handleChange('customer_email', e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-500">Vehicle Type</label>
          <Input value={form.vehicle_type} onChange={(e) => handleChange('vehicle_type', e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-500">VIN Number</label>
          <Input value={form.vin_number || ''} onChange={(e) => handleChange('vin_number', e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-500">Package</label>
          <Input value={form.package_type} onChange={(e) => handleChange('package_type', e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-500">Amount</label>
          <Input type="number" value={form.amount} onChange={(e) => handleChange('amount', e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-500">Currency</label>
          <select value={form.currency} onChange={(e) => handleChange('currency', e.target.value)} className="border rounded-md p-2 w-full">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-500">Country</label>
          <select value={form.country_code} onChange={(e) => handleChange('country_code', e.target.value)} className="border rounded-md p-2 w-full">
            {countriesList.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-500">State / Region</label>
          <select value={form.state || ''} onChange={(e) => handleChange('state', e.target.value)} className="border rounded-md p-2 w-full">
            <option value="">—</option>
            {getStatesForCountry(form.country_code).map(s => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-500">Payment Status</label>
          <select value={form.payment_status} onChange={(e) => handleChange('payment_status', e.target.value)} className="border rounded-md p-2 w-full">
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-500">Report Status</label>
          <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="border rounded-md p-2 w-full">
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-gray-500">Report URL</label>
          <Input value={form.report_url || ''} onChange={(e) => handleChange('report_url', e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button variant="outline" type="button" onClick={onClose} disabled={isSaving}>Cancel</Button>
        <Button type="submit" className="h-10" disabled={isSaving}>Update</Button>
      </div>
    </form>
  )
}
