'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload } from '@/components/upload/ImageUpload'
import { getSupabaseClientAsync } from '@/lib/supabase/client'

interface ProfilePictureSectionProps {
  userId: string
  currentAvatarUrl: string | null
}

export function ProfilePictureSection({ userId, currentAvatarUrl }: ProfilePictureSectionProps) {
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleUploadComplete = async (url: string) => {
    setSaving(true)
    setError(null)
    try {
      const supabase = await getSupabaseClientAsync()
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: url })
        .eq('id', userId)

      if (updateError) throw updateError

      setAvatarUrl(url)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile picture')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {avatarUrl && (
        <div className="flex items-center gap-4">
          <img
            src={avatarUrl}
            alt="Profile picture"
            className="h-20 w-20 rounded-full object-cover border-2 border-earth-200"
          />
          <span className="text-sm text-earth-500">Current profile picture</span>
        </div>
      )}

      <ImageUpload
        userId={userId}
        currentImageUrl={avatarUrl ?? undefined}
        onUploadComplete={handleUploadComplete}
        onUploadError={setError}
      />

      {saving && (
        <p className="text-sm text-earth-500">Saving to profile...</p>
      )}
    </div>
  )
}
