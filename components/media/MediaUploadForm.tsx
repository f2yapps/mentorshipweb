'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileUpload } from '@/components/upload/FileUpload'
import { uploadMedia } from '@/lib/storage'
import { getSupabaseClientAsync } from '@/lib/supabase/client'

interface MediaUploadFormProps {
  userId: string
  onSuccess?: () => void
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    // YouTube watch URL
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`
    }
    // YouTube short URL
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com') && !u.pathname.startsWith('/video')) {
      const id = u.pathname.replace(/^\//, '')
      if (/^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`
    }
    // Already embed URL
    if (u.pathname.startsWith('/embed') || u.pathname.startsWith('/video')) return url
  } catch {
    // not a valid URL
  }
  return null
}

export function MediaUploadForm({ userId, onSuccess }: MediaUploadFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoMode, setVideoMode] = useState<'url' | 'file'>('url')
  const [videoUrl, setVideoUrl] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media_type: 'image' as 'image' | 'video' | 'audio',
    tags: ''
  })

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
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

    const isVideoUrl = formData.media_type === 'video' && videoMode === 'url'

    if (!isVideoUrl && !selectedFile) {
      setError('Please select a file')
      return
    }
    if (isVideoUrl && !videoUrl.trim()) {
      setError('Please enter a YouTube or Vimeo URL')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let finalUrl = ''

      if (isVideoUrl) {
        const embed = toEmbedUrl(videoUrl.trim())
        if (!embed) {
          setError('Please enter a valid YouTube (youtube.com/watch?v=... or youtu.be/...) or Vimeo (vimeo.com/VIDEO_ID) URL')
          setLoading(false)
          return
        }
        finalUrl = embed
      } else {
        const uploadResult = await uploadMedia(selectedFile!, userId, formData.media_type)
        if (!uploadResult.success || !uploadResult.url) {
          throw new Error(uploadResult.error || 'Upload failed')
        }
        finalUrl = uploadResult.url
      }

      const supabase = await getSupabaseClientAsync()
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
          media_url: finalUrl,
          file_size_bytes: selectedFile?.size ?? null,
          tags: tagsArray,
          is_published: true
        })

      if (insertError) throw insertError

      setFormData({ title: '', description: '', media_type: 'image', tags: '' })
      setSelectedFile(null)
      setVideoUrl('')

      if (onSuccess) { onSuccess() } else { router.push('/media') }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload media')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Media type selector */}
      <div>
        <label className="block text-sm font-medium text-earth-700 mb-2">Media Type</label>
        <div className="flex gap-4">
          {(['image', 'video', 'audio'] as const).map((type) => (
            <label key={type} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                value={type}
                checked={formData.media_type === type}
                onChange={() => setFormData(prev => ({ ...prev, media_type: type }))}
              />
              {type === 'image' && '📷 Photo'}
              {type === 'video' && '🎥 Video'}
              {type === 'audio' && '🎵 Audio'}
            </label>
          ))}
        </div>
      </div>

      {/* Video: URL vs file toggle */}
      {formData.media_type === 'video' && (
        <div className="rounded-xl border border-primary-100 bg-primary-50 p-4 space-y-3">
          <p className="text-sm font-medium text-primary-900">How would you like to add your video?</p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-sm">
              <input type="radio" checked={videoMode === 'url'} onChange={() => setVideoMode('url')} />
              <span>YouTube / Vimeo link <span className="text-primary-600 font-medium">(recommended – no size limit)</span></span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-sm">
              <input type="radio" checked={videoMode === 'file'} onChange={() => setVideoMode('file')} />
              Upload file <span className="text-earth-500 text-xs">(max 50 MB)</span>
            </label>
          </div>

          {videoMode === 'url' && (
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Paste your YouTube or Vimeo URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="input w-full"
                placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
              />
              <p className="mt-1 text-xs text-earth-500">
                Supported: youtube.com/watch?v=..., youtu.be/..., vimeo.com/123456
              </p>
            </div>
          )}

          {videoMode === 'file' && (
            <div>
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-2">
                File uploads are limited to 50 MB. For longer videos, use the YouTube/Vimeo link option above.
              </p>
              <FileUpload
                bucket="media"
                onFileSelect={handleFileSelect}
                accept="video/*"
                label="Upload video"
                description="MP4, WebM. Max 50MB"
                preview={false}
              />
            </div>
          )}
        </div>
      )}

      {/* Image / Audio file upload */}
      {formData.media_type !== 'video' && (
        <FileUpload
          bucket="media"
          onFileSelect={handleFileSelect}
          accept={formData.media_type === 'image' ? 'image/*' : 'audio/*'}
          label={`Upload ${formData.media_type}`}
          description={
            formData.media_type === 'image' ? 'JPG, PNG, GIF, WebP. Max 50MB' : 'MP3, WAV, OGG. Max 50MB'
          }
          preview={formData.media_type === 'image'}
        />
      )}

      <div>
        <label className="block text-sm font-medium text-earth-700 mb-1">Title *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input w-full"
          placeholder="Give your post a title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="input w-full"
          placeholder="Tell us about this..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700 mb-1">Tags (comma-separated)</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="input w-full"
          placeholder="mentorship, success, inspiration"
        />
      </div>

      <button
        type="submit"
        disabled={loading || (!selectedFile && !(formData.media_type === 'video' && videoMode === 'url' && videoUrl.trim()))}
        className="btn-primary w-full"
      >
        {loading ? 'Publishing…' : 'Publish'}
      </button>
    </form>
  )
}
