"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/app/actions/events";

const TIMEZONES = [
  "UTC", "Africa/Nairobi", "Africa/Lagos", "Africa/Cairo", "Africa/Johannesburg",
  "Asia/Kolkata", "Asia/Dhaka", "Asia/Karachi", "Asia/Bangkok",
  "Europe/London", "Europe/Berlin", "America/New_York", "America/Los_Angeles",
  "Australia/Sydney",
];

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("is_online", String(isOnline));
    const result = await createEvent(formData);
    if (result.ok) {
      router.push(`/events/${result.eventId}`);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="section-heading">Create Event</h1>
      <p className="mt-2 text-earth-600">
        Host a workshop, webinar, meetup, or seminar for the community.
      </p>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Basic info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-earth-900">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              required
              placeholder="e.g. Career Development Workshop for Engineers"
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              placeholder="What will attendees learn or experience?"
              className="input w-full resize-y"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select name="event_type" className="input w-full" defaultValue="workshop">
                <option value="workshop">Workshop</option>
                <option value="webinar">Webinar</option>
                <option value="meetup">Meetup</option>
                <option value="conference">Conference</option>
                <option value="seminar">Seminar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Language</label>
              <input
                name="language"
                defaultValue="English"
                placeholder="English"
                className="input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">
              Topics / Tags <span className="text-xs text-earth-500">(comma-separated)</span>
            </label>
            <input
              name="tags"
              placeholder="e.g. career, leadership, tech"
              className="input w-full"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-earth-900">Date &amp; Time</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input name="event_date" type="date" required className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Time <span className="text-red-500">*</span>
              </label>
              <input name="event_time" type="time" required className="input w-full" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Timezone</label>
              <select name="timezone" className="input w-full" defaultValue="UTC">
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Duration (minutes)
              </label>
              <input
                name="duration_minutes"
                type="number"
                defaultValue={60}
                min={15}
                step={15}
                className="input w-full"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-earth-900">Location</h2>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isOnline}
                onChange={(e) => setIsOnline(e.target.checked)}
                className="h-4 w-4 rounded border-earth-300 text-primary-600"
              />
              <span className="text-sm text-earth-700">Online event</span>
            </label>
          </div>

          {isOnline && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">
                  Zoom Link
                </label>
                <input
                  name="zoom_link"
                  type="url"
                  placeholder="https://zoom.us/j/..."
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">
                  Google Meet Link
                </label>
                <input
                  name="google_meet_link"
                  type="url"
                  placeholder="https://meet.google.com/..."
                  className="input w-full"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">
              Physical Venue Address{" "}
              <span className="text-xs text-earth-500">(leave blank if online only)</span>
            </label>
            <input
              name="location"
              placeholder="e.g. Nairobi Innovation Hub, Kenya"
              className="input w-full"
            />
          </div>
        </div>

        {/* Capacity */}
        <div className="card p-6">
          <h2 className="font-semibold text-earth-900 mb-4">Capacity</h2>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">
              Max Attendees{" "}
              <span className="text-xs text-earth-500">(leave blank for unlimited)</span>
            </label>
            <input
              name="max_attendees"
              type="number"
              min={1}
              placeholder="e.g. 100"
              className="input w-full"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create Event"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
