"use client"

import { useState } from 'react'
import { X, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/translations'
import { showSwal } from '@/lib/swal'

interface ReviewFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function ReviewForm({ isOpen, onClose }: ReviewFormProps) {
  const { t } = useTranslations()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (rating === 0) {
      setError(t('review_error_select_rating'))
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          rating,
          comment,
        }),
      })

      // Parse response to get error details
      let data;
      try {
        data = await response.json()
      } catch (parseErr) {
        console.error('Failed to parse response:', parseErr)
        data = {}
      }

      if (!response.ok) {
        const errorMessage = data?.error || t('review_error_submit_failed') || 'Failed to submit review'
        console.error(`API Error (${response.status}):`, errorMessage, data)
        setError(errorMessage)
        setIsSubmitting(false)
        return
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        setName('')
        setEmail('')
        setRating(0)
        setComment('')
        setSubmitSuccess(false)
        onClose()
        window.location.reload()
      }, 2000)

      // show pending notice to user via SweetAlert popup
      showSwal({ title: t('review_alert_pending'), icon: 'info', timer: 2500, showConfirmButton: false })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      setError(errorMessage)
      console.error('Review submission error:', errorMessage, err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[80]"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[90] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">{t('review_write_title')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {submitSuccess ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('review_thank_you')}</h3>
              <p className="text-gray-600">{t('review_submitted_success')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('review_name_label')}
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('review_name_placeholder')}
                  required
                  className="h-12"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('review_email_label')}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('review_email_placeholder')}
                  required
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('review_rating_label')}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-[#b08a5a] text-[#b08a5a]'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('review_comment_label')}
                </label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('review_comment_placeholder')}
                  required
                  rows={5}
                  className="resize-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-600">{error}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-12"
                  disabled={isSubmitting}
                >
                  {t('review_cancel')}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('review_submitting') : t('review_submit')}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
