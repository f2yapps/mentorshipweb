import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatRelativeTime } from '@/lib/utils'

export default async function MediaGalleryPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch all published media posts
  const { data: mediaPosts } = await supabase
    .from('media_posts')
    .select(`
      *,
      user:users(id, name, avatar_url)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Media Gallery</h1>
            <p className="mt-2 text-gray-600">
              Photos, videos, and audio from our community
            </p>
          </div>
          {user && (
            <Link
              href="/media/upload"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Upload Media
            </Link>
          )}
        </div>

        {!mediaPosts || mediaPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No media posts yet</p>
            {user && (
              <Link
                href="/media/upload"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Be the first to share!
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Media Preview */}
                <div className="aspect-video bg-gray-200 relative">
                  {post.media_type === 'image' && (
                    <img
                      src={post.media_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {post.media_type === 'video' && (
                    <video
                      src={post.media_url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                  {post.media_type === 'audio' && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎵</div>
                        <audio src={post.media_url} controls className="w-full" />
                      </div>
                    </div>
                  )}
                  
                  {/* Media Type Badge */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {post.media_type === 'image' && '📷 Photo'}
                    {post.media_type === 'video' && '🎥 Video'}
                    {post.media_type === 'audio' && '🎵 Audio'}
                  </div>
                </div>

                {/* Post Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
                  {post.description && (
                    <p className="text-sm text-gray-600 mb-2">{post.description}</p>
                  )}
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Author & Time */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.user?.name || 'Anonymous'}</span>
                    <span>{formatRelativeTime(post.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
