import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { EducationForm } from '@/components/profile/EducationForm'
import { ExperienceForm } from '@/components/profile/ExperienceForm'
import { CertificationForm } from '@/components/profile/CertificationForm'
import { SocialLinksForm } from '@/components/profile/SocialLinksForm'
import { ProfilePictureSection } from '@/components/profile/ProfilePictureSection'

export default async function EditProfilePage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login?next=/profile/edit");

    // Fetch user profile
    const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch education
  const { data: education } = await supabase
    .from('education')
    .select('*')
    .eq('user_id', user.id)
    .order('start_date', { ascending: false })

  // Fetch experience
  const { data: experience } = await supabase
    .from('experience')
    .select('*')
    .eq('user_id', user.id)
    .order('start_date', { ascending: false })

  // Fetch certifications
  const { data: certifications } = await supabase
    .from('certifications')
    .select('*')
    .eq('user_id', user.id)
    .order('issue_date', { ascending: false })

  // Fetch social links
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
              <div className="mb-6 space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="border border-earth-200 rounded-lg p-4">
                    <h3 className="font-semibold text-earth-900">
                      {edu.degree} in {edu.field_of_study}
                    </h3>
                    <p className="text-earth-700">{edu.institution}</p>
                    <p className="text-sm text-earth-500">
                      {edu.start_date} - {edu.is_current ? 'Present' : edu.end_date}
                    </p>
                    {edu.location && (
                      <p className="text-sm text-earth-500">{edu.location}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-earth-900 mb-4">Add Education</h3>
              <EducationForm userId={user.id} />
            </div>
          </section>

          {/* Experience */}
          <section className="card p-6">
            <h2 className="text-lg font-semibold text-earth-900 mb-4">Work Experience</h2>
            
            {experience && experience.length > 0 && (
              <div className="mb-6 space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="border border-earth-200 rounded-lg p-4">
                    <h3 className="font-semibold text-earth-900">{exp.title}</h3>
                    <p className="text-earth-700">{exp.company}</p>
                    <p className="text-sm text-earth-500">
                      {exp.employment_type} • {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                    </p>
                    {exp.location && (
                      <p className="text-sm text-earth-500">{exp.location}</p>
                    )}
                    {exp.description && (
                      <p className="mt-2 text-sm text-earth-600">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-earth-900 mb-4">Add Experience</h3>
              <ExperienceForm userId={user.id} />
            </div>
          </section>

          {/* Certifications */}
          <section className="card p-6">
            <h2 className="text-lg font-semibold text-earth-900 mb-4">Certifications</h2>
            
            {certifications && certifications.length > 0 && (
              <div className="mb-6 space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="border border-earth-200 rounded-lg p-4">
                    <h3 className="font-semibold text-earth-900">{cert.name}</h3>
                    <p className="text-earth-700">{cert.issuing_organization}</p>
                    <p className="text-sm text-earth-500">
                      Issued: {cert.issue_date}
                      {cert.expiration_date && ` • Expires: ${cert.expiration_date}`}
                    </p>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline"
                      >
                        View Credential
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-earth-900 mb-4">Add Certification</h3>
              <CertificationForm userId={user.id} />
            </div>
          </section>

          {/* Social & Professional Links */}
          <section className="card p-6">
            <h2 className="text-lg font-semibold text-earth-900 mb-4">Social & Professional Links</h2>
            <p className="text-sm text-earth-600 mb-4">
              Add your Zoom, WhatsApp, LinkedIn, and other professional links
            </p>
            
            {socialLinks && socialLinks.length > 0 && (
              <div className="mb-6 space-y-3">
                {socialLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between border border-earth-200 rounded-lg p-3">
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
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Visit →
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-earth-900 mb-4">Add New Link</h3>
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
