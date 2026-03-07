'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClientAsync } from '@/lib/supabase/client';
import { MENTORSHIP_CATEGORIES, LANGUAGES } from '@/lib/constants';
import { toggleArrayItem } from '@/lib/utils';

interface MentorProfileFormProps {
  userId: string;
  name: string;
  email: string;
  initialCountry: string | null;
  initialBio: string | null;
  initialExpertiseCategories: string[];
  initialExperienceYears: number | null;
  initialAvailability: string | null;
  initialLanguages: string[] | null;
}

export function MentorProfileForm({
  userId,
  name,
  email,
  initialCountry,
  initialBio,
  initialExpertiseCategories,
  initialExperienceYears,
  initialAvailability,
  initialLanguages,
}: MentorProfileFormProps) {
  const router = useRouter();
  const [country, setCountry] = useState(initialCountry ?? '');
  const [bio, setBio] = useState(initialBio ?? '');
  const [expertiseCategories, setExpertiseCategories] = useState<string[]>(
    initialExpertiseCategories ?? [],
  );
  const [experienceYears, setExperienceYears] = useState<number>(
    initialExperienceYears ?? 0,
  );
  const [availability, setAvailability] = useState<string>(
    initialAvailability ?? 'flexible',
  );
  const [languages, setLanguages] = useState<string[]>(
    (initialLanguages && initialLanguages.length > 0
      ? initialLanguages
      : ['English']) ?? ['English'],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expertiseCategories.length === 0) {
      setError('Please select at least one area of expertise.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = await getSupabaseClientAsync();

      const profileUpdate: Record<string, string | null> = {
        country: country.trim() || null,
        bio: bio.trim() || null,
      };

      await supabase.from('users').update(profileUpdate).eq('id', userId);

      const mentorPayload = {
        user_id: userId,
        expertise_categories: expertiseCategories,
        experience_years: experienceYears,
        availability,
        languages,
      };

      const { error: insertError } = await supabase
        .from('mentors')
        .insert(mentorPayload);

      if (insertError) {
        if (insertError.code === '23505') {
          const { error: updateError } = await supabase
            .from('mentors')
            .update(mentorPayload)
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
          : 'Could not save your mentor profile. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-earth-900">
          Mentor profile (short)
        </h2>
        <p className="text-sm text-earth-600">
          Keep this brief. We only ask for the essentials mentees need to
          decide if you&apos;re a good fit.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          Saved. Your mentor card is now up to date.
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
          Short bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="input"
          placeholder="1-3 sentences about your background and how you can help."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700">
          Areas of expertise <span className="text-red-500">*</span>
        </label>
        <p className="mt-0.5 mb-2 text-xs text-earth-500">
          Choose the main topics you want to mentor in.
        </p>
        <div className="flex flex-wrap gap-2">
          {MENTORSHIP_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs sm:text-sm transition-colors ${
                expertiseCategories.includes(cat)
                  ? 'border-primary-500 bg-primary-50 text-primary-800'
                  : 'border-earth-300 bg-white text-earth-700 hover:border-primary-300'
              }`}
            >
              <input
                type="checkbox"
                checked={expertiseCategories.includes(cat)}
                onChange={() =>
                  setExpertiseCategories(
                    toggleArrayItem(expertiseCategories, cat),
                  )
                }
                className="sr-only"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">
            Years of experience
          </label>
          <input
            type="number"
            min={0}
            max={50}
            value={experienceYears}
            onChange={(e) =>
              setExperienceYears(parseInt(e.target.value || '0', 10) || 0)
            }
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">
            Availability
          </label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="input"
          >
            <option value="flexible">Flexible</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="evenings">Evenings</option>
            <option value="limited">Limited hours</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700">
          Languages you can mentor in
        </label>
        <p className="mt-0.5 mb-2 text-xs text-earth-500">
          Pick the languages you are comfortable mentoring in.
        </p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <label
              key={lang}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs sm:text-sm transition-colors ${
                languages.includes(lang)
                  ? 'border-primary-500 bg-primary-50 text-primary-800'
                  : 'border-earth-300 bg-white text-earth-700 hover:border-primary-300'
              }`}
            >
              <input
                type="checkbox"
                checked={languages.includes(lang)}
                onChange={() => setLanguages(toggleArrayItem(languages, lang))}
                className="sr-only"
              />
              {lang}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="btn-primary w-full sm:w-auto"
      >
        {saving ? 'Saving…' : 'Save mentor profile'}
      </button>
    </form>
  );
}

