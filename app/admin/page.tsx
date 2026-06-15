'use client'

import { useState } from 'react'

interface Order {
  id: string
  orderNumber: string
  customerEmail: string
  packageType: string
  amount: number
  currency: string
  status: 'Processing' | 'Refunded' | 'Complete' | 'Cancel' | 'Pending'
  createdAt: string
}

import { useTranslations } from '@/lib/translations'

export default function AdminPage() {
  const { t } = useTranslations()
  // The admin root should link to the dashboard and management pages instead of using mock data.
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">{t('admin_panel')}</h1>
      <p className="text-gray-600 mb-4">Use the admin dashboard to manage orders, contacts, reviews and settings.</p>
      <div className="flex gap-3">
        <a href="/admin/dashboard" className="inline-block bg-amber-600 text-white px-4 py-2 rounded">Dashboard</a>
        <a href="/admin/dashboard/orders" className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded">Orders</a>
        <a href="/admin/dashboard/contact" className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded">Contact</a>
      </div>
    </div>
  )
}

