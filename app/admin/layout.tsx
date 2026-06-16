'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingCart, Settings, LogOut, Menu, X, Star, MessageSquare, Car } from 'lucide-react'

import { useTranslations } from '@/lib/translations'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t } = useTranslations()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Hide the sidebar on the login page to prevent it staying visible after logout
  const isLoginRoute = pathname === '/admin/login'

  const [counts, setCounts] = useState({ orders: 0, reviews: 0, contacts: 0, registrations: 0 })

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  // Poll counts every 30s while admin is open
  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await fetch('/api/admin/counts', { headers })
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('admin_token')
          window.location.href = '/admin/login'
          return
        }
        return
      }
      const data = await res.json()
      setCounts({ orders: data.orders || 0, reviews: data.reviews || 0, contacts: data.contacts || 0, registrations: data.registrations || 0 })
    } catch (err) {
      console.error('Failed to load admin counts', err)
    }
  }

  useEffect(() => {
    // Don't poll admin endpoints when we're on the login route —
    // that causes a reload loop when the token is missing/invalid.
    if (isLoginRoute) return

    let mounted = true
    fetchCounts()
    const id = setInterval(fetchCounts, 30000)

    const onRefresh = () => fetchCounts()
    window.addEventListener('admin:counts:refresh', onRefresh)

    return () => {
      mounted = false
      clearInterval(id)
      window.removeEventListener('admin:counts:refresh', onRefresh)
    }
  }, [isLoginRoute])

  const handleLogout = () => {
    // clear token and ensure sidebar is closed before redirect
    localStorage.removeItem('admin_token')
    setIsSidebarOpen(false)
    window.location.href = '/admin/login'
  }

  const handleLinkClick = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 h-14 sm:h-16 flex items-center justify-between">
        <span className="font-bold text-base sm:text-lg">{t('admin_panel')}</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (hidden on /admin/login) */}
      {!isLoginRoute && (
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/admin/dashboard" className="flex items-center gap-2">\n            <img src="/logo.png" alt="True Inspectify" className="h-6 w-auto" />\n          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
          <Link
            href="/admin/dashboard"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              pathname === '/admin/dashboard'
                ? 'bg-amber-50 text-amber-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">{t('admin_dashboard')}</span>
          </Link>

          <Link
            href="/admin/dashboard/orders"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              isActive('/admin/dashboard/orders')
                ? 'bg-amber-50 text-amber-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate flex-1">{t('admin_orders')}</span>
            {counts.orders > 0 && (
              <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-amber-600 text-white text-xs font-semibold flex-shrink-0">{counts.orders}</span>
            )}
          </Link>

          <Link
            href="/admin/dashboard/reviews"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              isActive('/admin/dashboard/reviews')
                ? 'bg-amber-50 text-amber-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            {t('admin_reviews')}
            {counts.reviews > 0 && (
              <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-amber-600 text-white text-xs font-semibold">{counts.reviews}</span>
            )}
          </Link>

          <Link
            href="/admin/dashboard/contact"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive('/admin/dashboard/contact') ? 'bg-amber-50 text-amber-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            {t('nav_contact')}
            {counts.contacts > 0 && (
              <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-amber-600 text-white text-xs font-semibold">{counts.contacts}</span>
            )}
          </Link>

          <Link
            href="/admin/dashboard/registrations"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              isActive('/admin/dashboard/registrations')
                ? 'bg-amber-50 text-amber-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Car className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate flex-1">Vehicle Registrations</span>
            {counts.registrations > 0 && (
              <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-amber-600 text-white text-xs font-semibold flex-shrink-0">{counts.registrations}</span>
            )}
          </Link>

          <Link
            href="/admin/settings"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              pathname === '/admin/settings' ? 'bg-amber-50 text-amber-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Settings className="w-5 h-5" />
            {t('admin_settings')}
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('admin_logout') }
          </button>
        </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${!isLoginRoute ? 'md:ml-64' : ''} min-h-screen pt-16 md:pt-0 w-full`}>
        {children}
      </main>
    </div>
  )
}