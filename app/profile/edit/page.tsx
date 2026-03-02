import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { EducationForm } from '@/components/profile/EducationForm'
import { ExperienceForm } from '@/components/profile/ExperienceForm'
import { CertificationForm } from '@/components/profile/CertificationForm'
import { SocialLinksForm } from '@/components/profile/SocialLinksForm'
import { ProfilePictureSection } from '@/components/profile/ProfilePictureSection'
import { DeleteItemButton } from '@/components/profile/DeleteItemButton'

export default async function EditProfilePage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login?next=/profile/edit");

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    const { data: education } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })

    const { data: experience } = await supabase
      .from('experience')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })

    const { data: certifications } = await supabase
      .from('certifications')
      .select('*')
      .eq('user_id', user.id)
      .order('issue_date', { ascending: false })

    const { data: socialLinks } = await supabase
      .from('external_links')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return (
      <div className="min-h-screen bg-earth-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="section-heading">Edit Profile</h1>
            <p className="mt-2 text-earth-600">
              Build your professional profile to connect with mentors or mentees around the world.
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Picture */}
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-earth-900 mb-4">Profile Picture</h2>
              <ProfilePictureSection
                userId={user.id}
                currentAvatarUrl={profile?.avatar_url ?? null}
              />
            </section>

            {/* Basic Info */}
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-earth-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">Name</label>
                  <p className="text-earth-900">{profile?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">Email</label>
                  <p className="text-earth-900">{profile?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">Role</label>
                  <p className="text-earth-900 capitalize">{profile?.role}</p>
                </div>
              </div>
            </section>

            {/* Education */}
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-earth-900 mb-4">Education</h2>

              {education && education.length > 0 && (
                <div className="mb-6 space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex items-start justify-between gap-4 border border-earth-200 rounded-xl p-4">
                      <div>
                        <h3 className="font-semibold text-earth-900">
                          {edu.degree} in {edu.field_of_study}
                        </h3>
                        <p className="text-earth-700">{edu.institution}</p>
                        <p className="text-sm text-earth-500">
                          {edu.start_date} – {edu.is_current ? 'Present' : edu.end_date}
                          {edu.location && ` · ${edu.location}`}
                        </p>
                        {edu.grade && <p className="text-sm text-earth-500">Grade: {edu.grade}</p>}
                      </div>
                      <DeleteItemButton table="education" id={edu.id} />
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-earth-100 pt-5">
                <h3 className="text-base font-medium text-earth-900 mb-4">Add Education</h3>
                <EducationForm userId={user.id} />
              </div>
            </section>

            {/* Work Experience */}
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-earth-900 mb-4">Work Experience</h2>

              {experience && experience.length > 0 && (
                <div className="mb-6 space-y-3">
                  {experience.map((exp) => (
                    <div key={exp.id} className="flex items-start justify-between gap-4 border border-earth-200 rounded-xl p-4">
                      <div>
                        <h3 className="font-semibold text-earth-900">{exp.title}</h3>
                        <p className="text-earth-700">{exp.company}</p>
                        <p className="text-sm text-earth-500">
                          {exp.employment_type} · {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                          {exp.location && ` · ${exp.location}`}
                        </p>
                        {exp.description && (
                          <p className="mt-1 text-sm text-earth-600 line-clamp-2">{exp.description}</p>
                        )}
                        {exp.skills && exp.skills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {exp.skills.slice(0, 5).map((s: string) => (
                              <span key={s} className="rounded-full bg-earth-100 px-2 py-0.5 text-xs text-earth-700">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <DeleteItemButton table="experience" id={exp.id} />
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-earth-100 pt-5">
                <h3 className="text-base font-medium text-earth-900 mb-4">Add Experience</h3>
                <ExperienceForm userId={user.id} />
              </div>
            </section>

            {/* Certifications */}
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-earth-900 mb-4">Certifications</h2>

              {certifications && certifications.length > 0 && (
                <div className="mb-6 space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex items-start justify-between gap-4 border border-earth-200 rounded-xl p-4">
                      <div>
                        <h3 className="font-semibold text-earth-900">{cert.name}</h3>
                        <p className="text-earth-700">{cert.issuing_organization}</p>
                        <p className="text-sm text-earth-500">
                          Issued: {cert.issue_date}
                          {cert.expiration_date && ` · Expires: ${cert.expiration_date}`}
                        </p>
                        {cert.credential_url && (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:underline"
                          >
                            View Credential →
                          </a>
                        )}
                      </div>
                      <DeleteItemButton table="certifications" id={cert.id} />
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-earth-100 pt-5">
                <h3 className="text-base font-medium text-earth-900 mb-4">Add Certification</h3>
                <CertificationForm userId={user.id} />
              </div>
            </section>

            {/* Social & Professional Links */}
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-earth-900 mb-4">Social & Professional Links</h2>
              <p className="text-sm text-earth-600 mb-4">
                Add your Zoom, WhatsApp, LinkedIn, and other professional links so mentees can reach you.
              </p>

              {socialLinks && socialLinks.length > 0 && (
                <div className="mb-6 space-y-3">
                  {socialLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between gap-4 border border-earth-200 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {link.platform === 'zoom' && '📹'}
                          {link.platform === 'whatsapp' && '💬'}
                          {link.platform === 'linkedin' && '💼'}
                          {link.platform === 'google_scholar' && '🎓'}
                          {link.platform === 'youtube' && '▶️'}
                          {link.platform === 'calendly' && '📅'}
                          {link.platform === 'twitter' && '🐦'}
                          {link.platform === 'github' && '💻'}
                          {link.platform === 'website' && '🌐'}
                          {link.platform === 'other' && '🔗'}
                        </span>
                        <div>
                          <p className="font-medium text-earth-900 capitalize">
                            {link.platform.replace('_', ' ')}
                          </p>
                          {link.label && (
                            <p className="text-sm text-earth-500">{link.label}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:underline"
                        >
                          Visit →
                        </a>
                        <DeleteItemButton table="external_links" id={link.id} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-earth-100 pt-5">
                <h3 className="text-base font-medium text-earth-900 mb-4">Add New Link</h3>
                <SocialLinksForm userId={user.id} />
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    if (e && typeof e === "object" && (e as Error).message === "NEXT_REDIRECT") throw e;
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
