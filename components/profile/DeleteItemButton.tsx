'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClientAsync } from '@/lib/supabase/client'

type Props = {
  table: 'education' | 'experience' | 'certifications' | 'external_links'
  id: string
}

export function DeleteItemButton({ table, id }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleDelete = async () => {
    if (!confirmed) {
      setConfirmed(true)
      setTimeout(() => setConfirmed(false), 3000)
      return
    }
    setDeleting(true)
    try {
      const supabase = await getSupabaseClientAsync()
      await supabase.from(table).delete().eq('id', id)
      router.refresh()
    } finally {
      setDeleting(false)
      setConfirmed(false)
    }
  }

  if (deleting) {
    return <span className="text-xs text-earth-400">Deleting…</span>
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className={`text-xs font-medium transition-colors ${
        confirmed
          ? 'text-red-700 underline'
          : 'text-earth-400 hover:text-red-600'
      }`}
    >
      {confirmed ? 'Confirm delete' : 'Delete'}
    </button>
  )
}
