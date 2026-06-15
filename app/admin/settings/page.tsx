"use client"

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { Settings as SettingsIcon, Lock } from 'lucide-react'

type SettingsFormValues = {
  siteTitle?: string
  siteDescription?: string
  notificationEmail?: string
  emailFrom?: string
  autoApproveReviews?: boolean
  minRatingToFeature?: number
  maintenanceMode?: boolean
}

const SECTIONS = [
  { key: 'general', label: 'General', icon: SettingsIcon },
  { key: 'email', label: 'Email' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'security', label: 'Security', icon: Lock },
  { key: 'advanced', label: 'Advanced' },
]

function AdminSettingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialSection = (searchParams?.get('section')) || 'general'
  const [section, setSection] = useState<string>(initialSection)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const form = useForm<SettingsFormValues>({
    defaultValues: {
      siteTitle: '',
      siteDescription: '',
      notificationEmail: '',
      emailFrom: '',
      autoApproveReviews: false,
      minRatingToFeature: 4,
      maintenanceMode: false,
    },
  })

  const { reset, handleSubmit, control, formState } = form

  useEffect(() => {
    // keep URL in sync
    const url = new URL(window.location.href)
    url.searchParams.set('section', section)
    window.history.replaceState({}, '', url.toString())
  }, [section])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('admin_token')
        
        // Add error handling for fetch
        const res = await fetch(`/api/admin/settings?key=admin_${section}`, { 
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          signal: AbortSignal.timeout(10000) // 10 second timeout
        })
        
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('admin_token')
            router.push('/admin/login')
            return
          }

          // Try to parse structured error from the server to show a helpful message
          let errMsg = `Failed to load settings (status ${res.status})`
          try {
            const json = await res.json()
            if (json && (json.error || json.message)) {
              errMsg = json.error || json.message
            }
          } catch (parseErr) {
            try {
              const txt = await res.text()
              if (txt) errMsg = txt
            } catch (_) {
              // ignore
            }
          }

          throw new Error(errMsg)
        }
        
        const data = await res.json()
        const value = (data && data.success && data.value) || {}
        reset(value)
      } catch (err: any) {
        console.error('Failed to load settings', err)
        // Only show toast if error is not due to timeout
        if (err.name !== 'AbortError') {
          toast({ 
            title: 'Failed to load settings', 
            description: err?.message || 'Please try again later.' 
          } as any)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [section, reset, router, toast])

  const onSave = handleSubmit(async (values) => {
    try {
      setSaving(true)
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ key: `admin_${section}`, value: values }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save settings')
      }
      toast({ title: 'Settings saved', description: 'Your changes were saved successfully.' } as any)
      // reset dirty state
      reset(values)
    } catch (err: any) {
      console.error(err)
      toast({ title: 'Save failed', description: err?.message || 'Please try again.' } as any)
    } finally {
      setSaving(false)
    }
  })

  // Change password (security tab)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changing, setChanging] = useState(false)

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({ title: 'Please fill in both fields' } as any)
      return
    }
    if (newPassword.length < 8) {
      toast({ title: 'New password must be at least 8 characters' } as any)
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match' } as any)
      return
    }

    try {
      setChanging(true)
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to change password')
      }
      toast({ title: 'Password changed', description: 'Your password was updated.' } as any)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      console.error(err)
      toast({ title: 'Change failed', description: err?.message || 'Please try again.' } as any)
    } finally {
      setChanging(false)
    }
  }

  const sectionsNav = useMemo(() => SECTIONS, [])

  return (
    <div className="flex gap-8">
      <aside className="w-64 sticky top-20 self-start">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <nav className="space-y-2">
          {sectionsNav.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`flex items-center w-full gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${s.key === section ? 'bg-amber-50 text-amber-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              {s.icon && <s.icon className="w-4 h-4" />}
              <span>{s.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">{section} settings</h1>
          <p className="text-gray-600">Configure settings for the {section} section</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={onSave} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
              {section === 'general' && (
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={control}
                    name="siteTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="My website" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Short description shown in metadata" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {section === 'email' && (
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={control}
                    name="notificationEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="notifications@example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="emailFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email From</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="no-reply@example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {section === 'reviews' && (
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={control}
                    name="autoApproveReviews"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Auto-approve reviews</FormLabel>
                          <FormControl>
                            <p className="text-sm text-muted-foreground">Automatically approve incoming reviews</p>
                          </FormControl>
                        </div>
                        <FormControl>
                          <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="minRatingToFeature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum rating to feature</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={1} max={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {section === 'advanced' && (
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={control}
                    name="maintenanceMode"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Maintenance mode</FormLabel>
                          <FormControl>
                            <p className="text-sm text-muted-foreground">Put site in maintenance mode for updates</p>
                          </FormControl>
                        </div>
                        <FormControl>
                          <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {section === 'security' && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white p-4 rounded-md border">
                    <h3 className="text-lg font-medium mb-3">Change password</h3>

                    <div className="grid grid-cols-1 gap-3 max-w-md">
                      <label className="text-sm font-medium">Current password</label>
                      <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />

                      <label className="text-sm font-medium">New password</label>
                      <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                      <label className="text-sm font-medium">Confirm new password</label>
                      <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                      <div className="flex gap-2">
                        <Button onClick={handleChangePassword} disabled={changing || !currentPassword || !newPassword || newPassword.length < 8 || newPassword !== confirmPassword}>{changing ? 'Changing...' : 'Change password'}</Button>
                        <Button variant="outline" onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }} disabled={changing}>Reset</Button>
                      </div>

                      <p className="text-xs text-muted-foreground">Password must be at least 8 characters.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button type="submit" className="h-10" disabled={saving || !formState.isDirty}>{saving ? 'Saving...' : 'Save changes'}</Button>
                <Button variant="outline" onClick={() => reset()} disabled={saving}>Reset</Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  )
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading settings...</div>}>
      <AdminSettingsContent />
    </Suspense>
  )
}
