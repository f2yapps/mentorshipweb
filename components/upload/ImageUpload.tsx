'use client'

import { useState } from 'react'
import { FileUpload } from './FileUpload'
import { uploadProfileImage, compressImage } from '@/lib/storage'
import { Button } from '@/components/ui/Button'

interface ImageUploadProps {
  userId: string
  currentImageUrl?: string
  onUploadComplete: (url: string) => void
  onUploadError?: (error: string) => void
  label?: string
  description?: string
}

export function ImageUpload({
  userId,
  currentImageUrl,
  onUploadComplete,
  onUploadError,
  label = 'Upload Profile Picture',
  description = 'JPG, PNG, or WebP. Max 5MB.'
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setProgress(0)

    try {
      // Compress image before upload
      const compressedFile = await compressImage(selectedFile, 1920, 0.85)
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      // Upload to Supabase
      const result = await uploadProfileImage(compressedFile, userId)
      
      clearInterval(progressInterval)
      setProgress(100)

      if (result.success && result.url) {
        onUploadComplete(result.url)
        setSelectedFile(null)
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      if (onUploadError) {
        onUploadError(errorMessage)
      }
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      <FileUpload
        bucket="profile-images"
        onFileSelect={handleFileSelect}
        accept="image/*"
        label={label}
        description={description}
        preview={true}
        currentFileUrl={currentImageUrl}
        disabled={uploading}
      />

      {selectedFile && !uploading && (
        <Button onClick={handleUpload} className="w-full">
          Upload Image
        </Button>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            Uploading... {progress}%
          </p>
        </div>
      )}
    </div>
  )
}
