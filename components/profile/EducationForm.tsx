'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CreateEducationInput } from '@/types/database'
import { createClient } from '@/lib/supabase/client'

interface EducationFormProps {
  userId: string
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: CreateEducationInput & { id?: string }
}

export function EducationForm({ userId, onSuccess, onCancel, initialData }: EducationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateEducationInput>({
    institution: initialData?.institution || '',
    degree: initialData?.degree || '',
    field_of_study: initialData?.field_of_study || '',
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || null,
    is_current: initialData?.is_current || false,
    description: initialData?.description || null,
    location: initialData?.location || null,
    grade: initialData?.grade || null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      if (initialData?.id) {
        // Update existing
        const { error: updateError } = await supabase
          .from('education')
          .update(formData)
          .eq('id', initialData.id)

        if (updateError) throw updateError
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('education')
          .insert({ ...formData, user_id: userId })

        if (insertError) throw insertError
      }

      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save education')
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
          Institution *
        </label>
        <input
          type="text"
          required
          value={formData.institution}
          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Harvard University"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Degree *
          </label>
          <input
            type="text"
            required
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Bachelor of Science"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field of Study *
          </label>
          <input
            type="text"
            required
            value={formData.field_of_study}
            onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Computer Science"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value || null })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Cambridge, MA, USA"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="month"
            required
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date {formData.is_current && '(or expected)'}
          </label>
          <input
            type="month"
            value={formData.end_date || ''}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value || null })}
            disabled={formData.is_current}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_current"
          checked={formData.is_current}
          onChange={(e) => setFormData({ 
            ...formData, 
            is_current: e.target.checked,
            end_date: e.target.checked ? null : formData.end_date
          })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_current" className="ml-2 block text-sm text-gray-700">
          I currently study here
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Grade / GPA
        </label>
        <input
          type="text"
          value={formData.grade || ''}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value || null })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="3.8 GPA"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Activities, achievements, coursework..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData?.id ? 'Update' : 'Add Education'}
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
