/**
 * Supabase Storage utilities for file uploads
 */

import { createClient } from '@/lib/supabase/client'
import { generateUniqueFileName, isValidFileSize, isValidFileType } from './utils'

export type StorageBucket = 'profile-images' | 'publications' | 'media' | 'resources'

interface UploadOptions {
  bucket: StorageBucket
  file: File
  userId: string
  folder?: string
  onProgress?: (progress: number) => void
}

interface UploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

/**
 * File type validation rules for each bucket
 */
const BUCKET_RULES: Record<StorageBucket, { maxSizeMB: number; allowedTypes: string[] }> = {
  'profile-images': {
    maxSizeMB: 5,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  },
  'publications': {
    maxSizeMB: 50,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  },
  'media': {
    maxSizeMB: 500,
    allowedTypes: [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif'
    ]
  },
  'resources': {
    maxSizeMB: 50,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'application/zip'
    ]
  }
}

/**
 * Validate file before upload
 */
export function validateFile(file: File, bucket: StorageBucket): { valid: boolean; error?: string } {
  const rules = BUCKET_RULES[bucket]
  
  if (!isValidFileType(file, rules.allowedTypes)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${rules.allowedTypes.join(', ')}`
    }
  }
  
  if (!isValidFileSize(file, rules.maxSizeMB)) {
    return {
      valid: false,
      error: `File size exceeds ${rules.maxSizeMB}MB limit`
    }
  }
  
  return { valid: true }
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile({
  bucket,
  file,
  userId,
  folder,
  onProgress
}: UploadOptions): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file, bucket)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }
    
    const supabase = createClient()
    
    // Generate unique file name
    const fileName = generateUniqueFileName(file.name)
    
    // Construct file path: userId/folder/fileName or userId/fileName
    const filePath = folder 
      ? `${userId}/${folder}/${fileName}`
      : `${userId}/${fileName}`
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: error.message }
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)
    
    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath
    }
  } catch (error) {
    console.error('Upload exception:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(bucket: StorageBucket, path: string): Promise<boolean> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) {
      console.error('Delete error:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Delete exception:', error)
    return false
  }
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const supabase = createClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Upload profile image
 */
export async function uploadProfileImage(file: File, userId: string): Promise<UploadResult> {
  return uploadFile({
    bucket: 'profile-images',
    file,
    userId,
    folder: 'avatars'
  })
}

/**
 * Upload publication file
 */
export async function uploadPublication(file: File, userId: string): Promise<UploadResult> {
  return uploadFile({
    bucket: 'publications',
    file,
    userId
  })
}

/**
 * Upload media file (video, audio, image)
 */
export async function uploadMedia(file: File, userId: string, type: 'video' | 'audio' | 'image'): Promise<UploadResult> {
  return uploadFile({
    bucket: 'media',
    file,
    userId,
    folder: type
  })
}

/**
 * Upload resource file
 */
export async function uploadResource(file: File, userId: string): Promise<UploadResult> {
  return uploadFile({
    bucket: 'resources',
    file,
    userId
  })
}

/**
 * Upload cover image for success story
 */
export async function uploadCoverImage(file: File, userId: string): Promise<UploadResult> {
  return uploadFile({
    bucket: 'media',
    file,
    userId,
    folder: 'covers'
  })
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Get file type category from MIME type
 */
export function getFileTypeCategory(mimeType: string): 'image' | 'video' | 'audio' | 'document' | 'other' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('msword') ||
    mimeType.includes('powerpoint') ||
    mimeType.includes('excel') ||
    mimeType.includes('text/')
  ) return 'document'
  return 'other'
}

/**
 * Create thumbnail for video (client-side)
 */
export async function createVideoThumbnail(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    if (!context) {
      resolve(null)
      return
    }
    
    video.preload = 'metadata'
    video.src = URL.createObjectURL(file)
    
    video.onloadeddata = () => {
      // Seek to 1 second or 10% of video
      video.currentTime = Math.min(1, video.duration * 0.1)
    }
    
    video.onseeked = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(video.src)
        resolve(blob)
      }, 'image/jpeg', 0.8)
    }
    
    video.onerror = () => {
      URL.revokeObjectURL(video.src)
      resolve(null)
    }
  })
}

/**
 * Compress image before upload
 */
export async function compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }
        
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }
            
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            
            resolve(compressedFile)
          },
          'image/jpeg',
          quality
        )
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
  })
}
