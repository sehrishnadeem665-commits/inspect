"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, LogOut, Menu, X, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  if (!isAuthenticated) {
    return null
  }

  // Dashboard layout should not render its own sidebar (top-level admin layout handles it)
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1 p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}
