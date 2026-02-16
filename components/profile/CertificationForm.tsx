'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CreateCertificationInput } from '@/types/database'
import { createClient } from '@/lib/supabase/client'

interface CertificationFormProps {
  userId: string
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: CreateCertificationInput & { id?: string }
}

export function CertificationForm({ userId, onSuccess, onCancel, initialData }: CertificationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateCertificationInput>({
    name: initialData?.name || '',
    issuing_organization: initialData?.issuing_organization || '',
    issue_date: initialData?.issue_date || '',
    expiration_date: initialData?.expiration_date || null,
    credential_id: initialData?.credential_id || null,
    credential_url: initialData?.credential_url || null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from('certifications')
          .update(formData)
          .eq('id', initialData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('certifications')
          .insert({ ...formData, user_id: userId })

        if (insertError) throw insertError
      }

      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save certification')
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
          Certification Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="AWS Certified Solutions Architect"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Issuing Organization *
        </label>
        <input
          type="text"
          required
          value={formData.issuing_organization}
          onChange={(e) => setFormData({ ...formData, issuing_organization: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Amazon Web Services"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Date *
          </label>
          <input
            type="month"
            required
            value={formData.issue_date}
            onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiration Date
          </label>
          <input
            type="month"
            value={formData.expiration_date || ''}
            onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value || null })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Credential ID
        </label>
        <input
          type="text"
          value={formData.credential_id || ''}
          onChange={(e) => setFormData({ ...formData, credential_id: e.target.value || null })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ABC123XYZ"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Credential URL
        </label>
        <input
          type="url"
          value={formData.credential_url || ''}
          onChange={(e) => setFormData({ ...formData, credential_url: e.target.value || null })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://www.credly.com/badges/..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData?.id ? 'Update' : 'Add Certification'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
