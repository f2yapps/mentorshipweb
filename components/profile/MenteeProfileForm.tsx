'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClientAsync } from '@/lib/supabase/client';
import { MENTORSHIP_CATEGORIES } from '@/lib/constants';
import { toggleArrayItem } from '@/lib/utils';

interface MenteeProfileFormProps {
  userId: string;
  name: string;
  email: string;
  initialCountry: string | null;
  initialGoals: string | null;
  initialPreferredCategories: string[];
}

export function MenteeProfileForm({
  userId,
  name,
  email,
  initialCountry,
  initialGoals,
  initialPreferredCategories,
}: MenteeProfileFormProps) {
  const router = useRouter();
  const [country, setCountry] = useState(initialCountry ?? '');
  const [goals, setGoals] = useState(initialGoals ?? '');
  const [preferredCategories, setPreferredCategories] = useState<string[]>(
    initialPreferredCategories ?? [],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (preferredCategories.length === 0) {
      setError('Select at least one area you want mentorship in.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = await getSupabaseClientAsync();

      const profileUpdate: Record<string, string | null> = {
        country: country.trim() || null,
      };

      await supabase.from('users').update(profileUpdate).eq('id', userId);

      const menteePayload = {
        user_id: userId,
        goals: goals.trim() || null,
        preferred_categories: preferredCategories,
      };

      const { error: insertError } = await supabase
        .from('mentees')
        .insert(menteePayload);

      if (insertError) {
        if (insertError.code === '23505') {
          const { error: updateError } = await supabase
            .from('mentees')
            .update({
              goals: menteePayload.goals,
              preferred_categories: preferredCategories,
            })
            .eq('user_id', userId);
          if (updateError) throw updateError;
        } else {
          throw insertError;
        }
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not save your mentee profile. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-earth-900">
          Mentee profile (short)
        </h2>
        <p className="text-sm text-earth-600">
          Just the basics your future mentor needs to understand who you are
          and what you&apos;re looking for.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          Saved. Your mentee profile is up to date.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-earth-600 mb-1">
            Name
          </label>
          <p className="text-sm text-earth-900">{name}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-earth-600 mb-1">
            Email
          </label>
          <p className="text-sm text-earth-900">{email}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700 mb-1">
          Country
        </label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="input"
          placeholder="e.g. Ethiopia, Kenya, Nigeria"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700 mb-1">
          What do you hope to achieve?
        </label>
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          rows={3}
          className="input"
          placeholder="Short description of your goals (study, career, projects, etc.)."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700">
          Areas you want mentorship in <span className="text-red-500">*</span>
        </label>
        <p className="mt-0.5 mb-2 text-xs text-earth-500">
          Select the main topics you want guidance in.
        </p>
        <div className="flex flex-wrap gap-2">
          {MENTORSHIP_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs sm:text-sm transition-colors ${
                preferredCategories.includes(cat)
                  ? 'border-primary-500 bg-primary-50 text-primary-800'
                  : 'border-earth-300 bg-white text-earth-700 hover:border-primary-300'
              }`}
            >
              <input
                type="checkbox"
                checked={preferredCategories.includes(cat)}
                onChange={() =>
                  setPreferredCategories(
                    toggleArrayItem(preferredCategories, cat),
                  )
                }
                className="sr-only"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="btn-primary w-full sm:w-auto"
      >
        {saving ? 'Saving…' : 'Save mentee profile'}
      </button>
    </form>
  );
}

