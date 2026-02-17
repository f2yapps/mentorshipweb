'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

interface SocialLinksFormProps {
  userId: string
  onSuccess?: () => void
}

const PLATFORMS = [
  { value: 'zoom', label: 'Zoom', icon: '📹' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'google_scholar', label: 'Google Scholar', icon: '🎓' },
  { value: 'youtube', label: 'YouTube', icon: '▶️' },
  { value: 'calendly', label: 'Calendly', icon: '📅' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { value: 'github', label: 'GitHub', icon: '💻' },
  { value: 'website', label: 'Personal Website', icon: '🌐' },
  { value: 'other', label: 'Other', icon: '🔗' }
]

export function SocialLinksForm({ userId, onSuccess }: SocialLinksFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    platform: 'zoom',
    url: '',
    label: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: insertError } = await supabase
        .from('external_links')
        .insert({
          user_id: userId,
          platform: formData.platform,
          url: formData.url,
          label: formData.label || null
        })

      if (insertError) throw insertError
      
      // Reset form
      setFormData({ platform: 'zoom', url: '', label: '' })
      
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Platform *
        </label>
        <select
          value={formData.platform}
          onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {PLATFORMS.map(platform => (
            <option key={platform.value} value={platform.value}>
              {platform.icon} {platform.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL *
        </label>
        <input
          type="url"
          required
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://zoom.us/j/123456789"
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.platform === 'zoom' && 'Example: https://zoom.us/j/123456789'}
          {formData.platform === 'whatsapp' && 'Example: https://wa.me/1234567890'}
          {formData.platform === 'linkedin' && 'Example: https://linkedin.com/in/yourname'}
          {formData.platform === 'calendly' && 'Example: https://calendly.com/yourname'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Label (Optional)
        </label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="My Meeting Room"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Link'}
      </Button>
    </form>
  )
}
