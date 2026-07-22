import React from 'react'
import { useTheme } from '../Context/Theme'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

function TermsofServise() {

    const { theme } = useTheme();
    const dark = theme === 'dark';
    const path = useNavigate()

    const bg = dark ? 'bg-zinc-950' : 'bg-white'
    const text = dark ? 'text-white' : 'text-black'
    const sub = dark ? 'text-zinc-400' : 'text-zinc-600'
    const card = `border-2 rounded p-5 ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black'}`

    const sections = [
        {
            title: '1. Acceptance of Terms',
            body: `By creating an account or using MusicMenia, you agree to these Terms of
        Service. If you don't agree, please don't use the app.`
        },
        {
            title: '2. Your Account',
            body: `You're responsible for keeping your login details secure and for all
        activity that happens under your account. You must provide accurate
        information when signing up, and you must be at least 13 years old to
        create an account.`
        },
        {
            title: '3. Content You Upload',
            body: `If you're an artist uploading music, you keep ownership of your tracks.
        By uploading, you give MusicMenia permission to store and stream that
        content to other users through the app. You are responsible for making
        sure you have the rights to any music, artwork, or thumbnails you upload.`
        },
        {
            title: '4. Copyright & Ownership',
            body: `Do not upload music, artwork, or other content that you don't own or
        don't have permission to share. MusicMenia may remove content that
        infringes on someone else's copyright, and repeated violations may lead
        to account suspension.`
        },
        {
            title: '5. Prohibited Conduct',
            body: `You agree not to misuse MusicMenia — this includes uploading harmful
        or illegal content, attempting to hack or disrupt the service, impersonating
        another person, or using the platform to harass other users.`
        },
        {
            title: '6. Account Suspension & Termination',
            body: `We may suspend or terminate accounts that violate these terms, including
        copyright infringement, abusive behavior, or attempts to compromise the
        platform's security.`
        },
        {
            title: '7. Service Availability',
            body: `MusicMenia is provided "as is." We do our best to keep the app running
        smoothly, but we don't guarantee uninterrupted access, and features may
        change or be removed over time.`
        },
        {
            title: '8. Limitation of Liability',
            body: `MusicMenia is not liable for any indirect or incidental damages arising
        from your use of the app, to the fullest extent permitted by law.`
        },
        {
            title: '9. Changes to These Terms',
            body: `We may update these Terms of Service from time to time. Continued use
        of MusicMenia after changes means you accept the updated terms.`
        },
        {
            title: '10. Contact Us',
            body: `Questions about these terms? Reach out to us at
        support@musicmenia.app.`
        },
    ]

    return (
        <main className={`min-h-screen pt-6 pb-16 px-4 ${bg} ${text}`}>

            <div className='max-w-2xl mx-auto space-y-4'>
                {/* back  button  */}
                <button
                    onClick={() => path(-1)}
                    className={`flex items-center gap-1 text-sm font-bold `}
                >
                    <ChevronLeft size={10} /> Back
                </button>
                {/* Header */}
                <div>
                    <h1 className=''>
                        Terms of Service
                    </h1>
                    <p>last update: July 2026</p>
                </div>
                <p className={`text-sm leading-relaxed ${sub}`}>
                    These Terms of Service govern your use of MusicMenia. Please read them
                    carefully before using the app to stream, upload, or share music.
                </p>
                {/* term section  */}
                {sections.map(({ title, body }) => (
                    <div key={title} className={card}>
                        <h2 className="text-sm font-black uppercase tracking-wide mb-2">{title}</h2>
                        <p className={`text-sm leading-releaxed ${sub}`}>{body}</p>

                    </div>
                ))}
            </div>
        </main>
    )
}

export default TermsofServise