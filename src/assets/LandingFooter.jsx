import React from 'react'
import { useTheme } from '../Context/Theme'

function LandingFooter() {
    const { theme } = useTheme()
    const dark = theme === "dark"

    const links = [
        { id: 1, label: "Terms & Conditions", url: "/" },
        { id: 2, label: "Privacy Policy", url: "/" },
        { id: 3, label: "FAQ", url: "/" },
        { id: 4, label: "Contact", url: "/" },
    ]

    const socials = [
        { label: "Instagram", url: "/" },
        { label: "Twitter / X", url: "/" },
        { label: "YouTube", url: "/" },
        { label: "Spotify", url: "/" },
    ]

    return (
        <footer className={`${dark ? "bg-gray-950 text-white border-gray-800" : "bg-gray-50 text-gray-900 border-gray-200"} border-t`}>

            {/* Main footer grid */}
            <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* Brand */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src="/music.png"
                            alt="MusicMenia"
                            className="h-10 w-10 object-contain"
                        />
                        <span className="text-2xl font-bold tracking-tight">MusicMenia</span>
                    </div>
                    <p className={`text-xl leading-relaxed max-w-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                        We are a team of music enthusiasts dedicated to providing the best music experience — discover, upload, and share short clips from artists around you.
                    </p>
                    <p className={`text-2xl mt-4 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        📍 123 Music Street, Tune City, Maharashtra, India
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className={`text-2xl font-semibold uppercase inline-block border-blue-500 border-b-2 tracking-widest mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                        Quick Links
                    </h3>
                    <ul className="space-y-3">
                        {links.map(l => (
                            <li key={l.id}>
                            <a
                                    href={l.url}
                                    className={`text-xl transition-colors ${dark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h3 className={`text-2xl font-semibold uppercase inline-block border-blue-500 border-b-2  tracking-widest mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                        Follow Us
                    </h3>
                    <ul className="space-y-3">
                        {socials.map(s => (
                            <li key={s.label}>
                                
                                <a
                                    href={s.url}
                                    className={`text-xl transition-colors ${dark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                                >
                                    {s.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

            </div> 

            {/* Bottom bar */}
            <div className={`border-t ${dark ? "border-gray-800" : "border-gray-200"}`}>
                <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className={`text-base md:text-2xl ${dark ? "text-gray-600" : "text-gray-400"}`}>
                        © {new Date().getFullYear()} MusicMenia. All rights reserved.
                    </p>
                    <p className={`text-base md:text-2xl tracking-widest ${dark ? "text-gray-600" : "text-gray-400"}`}>
                        🎵 DISCOVER · CREATE · SHARE
                    </p>
                </div>
            </div>

        </footer>
    )
}

export default LandingFooter

