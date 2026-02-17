'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { FileUpload } from '@/components/upload/FileUpload'
import { uploadMedia } from '@/lib/storage'
import { createClient } from '@/lib/supabase/client'

interface MediaUploadFormProps {
  userId: string
  onSuccess?: () => void
}

export function MediaUploadForm({ userId, onSuccess }: MediaUploadFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media_type: 'image' as 'image' | 'video' | 'audio',
    tags: ''
  })

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    
    // Auto-detect media type
    if (file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, media_type: 'image' }))
    } else if (file.type.startsWith('video/')) {
      setFormData(prev => ({ ...prev, media_type: 'video' }))
    } else if (file.type.startsWith('audio/')) {
      setFormData(prev => ({ ...prev, media_type: 'audio' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setError('Please select a file')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Upload file to Supabase Storage
      const uploadResult = await uploadMedia(selectedFile, userId, formData.media_type)
      
      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || 'Upload failed')
      }

      // Save media post to database
      const supabase = createClient()
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const { error: insertError } = await supabase
        .from('media_posts')
        .insert({
          user_id: userId,
          title: formData.title,
          description: formData.description || null,
          media_type: formData.media_type,
          media_url: uploadResult.url,
          file_size_bytes: selectedFile.size,
          tags: tagsArray,
          is_published: true
        })

      if (insertError) throw insertError

      // Reset form
      setFormData({ title: '', description: '', media_type: 'image', tags: '' })
      setSelectedFile(null)
      
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload media')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Media Type *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="image"
              checked={formData.media_type === 'image'}
              onChange={(e) => setFormData({ ...formData, media_type: 'image' })}
              className="mr-2"
            />
            📷 Photo
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="video"
              checked={formData.media_type === 'video'}
              onChange={(e) => setFormData({ ...formData, media_type: 'video' })}
              className="mr-2"
            />
            🎥 Video
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="audio"
              checked={formData.media_type === 'audio'}
              onChange={(e) => setFormData({ ...formData, media_type: 'audio' })}
              className="mr-2"
            />
            🎵 Audio
          </label>
        </div>
      </div>

      <FileUpload
        bucket="media"
        onFileSelect={handleFileSelect}
        accept={
          formData.media_type === 'image' ? 'image/*' :
          formData.media_type === 'video' ? 'video/*' :
          'audio/*'
        }
        label={`Upload ${formData.media_type}`}
        description={
          formData.media_type === 'image' ? 'JPG, PNG, GIF, WebP. Max 50MB' :
          formData.media_type === 'video' ? 'MP4, WebM. Max 500MB' :
          'MP3, WAV, OGG. Max 100MB'
        }
        preview={true}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="My awesome photo/video"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about this media..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="mentorship, success, inspiration"
        />
      </div>

      <Button type="submit" disabled={loading || !selectedFile}>
        {loading ? 'Uploading...' : 'Upload & Publish'}
      </Button>
    </form>
  )
}
