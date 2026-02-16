'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { formatFileSize, isValidFileSize, isValidFileType } from '@/lib/utils'
import { StorageBucket, validateFile } from '@/lib/storage'

interface FileUploadProps {
  bucket: StorageBucket
  onFileSelect: (file: File) => void
  accept?: string
  maxSizeMB?: number
  label?: string
  description?: string
  preview?: boolean
  currentFileUrl?: string
  disabled?: boolean
}

export function FileUpload({
  bucket,
  onFileSelect,
  accept,
  maxSizeMB,
  label = 'Upload File',
  description,
  preview = true,
  currentFileUrl,
  disabled = false
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentFileUrl || null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    processFile(file)
  }

  const processFile = (file: File) => {
    setError(null)

    // Validate file
    const validation = validateFile(file, bucket)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setSelectedFile(file)
    onFileSelect(file)

    // Generate preview for images
    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else if (preview && file.type.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(file)
      setPreviewUrl(videoUrl)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setPreviewUrl(currentFileUrl || null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!disabled ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
        />

        <div className="text-center">
          {previewUrl && preview ? (
            <div className="mb-4">
              {selectedFile?.type.startsWith('image/') || currentFileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg object-cover"
                />
              ) : selectedFile?.type.startsWith('video/') ? (
                <video
                  src={previewUrl}
                  className="max-h-48 mx-auto rounded-lg"
                  controls
                />
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-gray-600 font-medium">{label}</p>
            </div>
          )}

          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}

          {selectedFile && (
            <div className="mt-3 text-sm text-gray-600">
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      )}

      {selectedFile && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRemove}
          disabled={disabled}
        >
          Remove File
        </Button>
      )}
    </div>
  )
}
