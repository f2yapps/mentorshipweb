import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, User, Bell, Shield, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account and preferences.",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/settings");

  return (
    <div className="min-h-screen bg-earth-50/50">
      <div className="border-b border-earth-100 bg-white py-8">
        <div className="container-wide">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-earth-600 hover:text-primary-600">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-earth-900 sm:text-3xl">Settings</h1>
          <p className="mt-1 text-earth-600">Manage your account and preferences.</p>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <section className="card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-semibold text-earth-900">Profile</h2>
                <p className="text-sm text-earth-500">Update your name, bio, and profile details.</p>
              </div>
            </div>
            <Link href="/profile/edit" className="btn-secondary mt-4 inline-flex">
              Edit profile
            </Link>
          </section>

          <section className="card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-earth-100 text-earth-600">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-semibold text-earth-900">Notifications</h2>
                <p className="text-sm text-earth-500">Mentorship requests, messages, and event reminders.</p>
              </div>
            </div>
            <Link href="/notifications" className="btn-secondary mt-4 inline-flex">
              View notifications
            </Link>
          </section>

          <section className="card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-earth-100 text-earth-600">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-semibold text-earth-900">Privacy & Security</h2>
                <p className="text-sm text-earth-500">Password and account security.</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-earth-500">
              Password changes are managed through your email provider (Supabase Auth). Contact support if you need help.
            </p>
          </section>

          <section className="card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-earth-100 text-earth-600">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-semibold text-earth-900">Contact & Support</h2>
                <p className="text-sm text-earth-500">Get help or send feedback.</p>
              </div>
            </div>
            <Link href="/contact" className="btn-secondary mt-4 inline-flex">
              Contact us
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
