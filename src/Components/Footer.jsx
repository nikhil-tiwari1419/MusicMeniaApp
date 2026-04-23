import React from 'react'
import { useNavigate } from 'react-router-dom'
// import { ImReddit } from "react-icons/im";
import { Linkedin, Instagram, Facebook, Github } from 'lucide-react';
import { useTheme } from '../Context/Theme';

function Footer() {

    const { theme } = useTheme();
    const navigate = useNavigate();

    const socialLinks = [
        { name: "LinkedIn", icon: <Linkedin />, url: "https://linkedin.com" },
        { name: "Instagram", icon: <Instagram />, url: "https://instagram.com" },
        { name: "Facebook", icon: <Facebook />, url: "https://facebook.com" },
        { name: "Github", icon: <Github />, url: "https://github.com" },
        // { name: "Reddit", icon: <ImReddit size={27} />, url: "https://reddit.com" },
    ];

    // const quickLinks = [
    //     { label: "Home", path: "/" },
    //     { label: "Create Music", path: "/create-music" },
    //     { label: "Create Playlist", path: "/album" },
    //     { label: "About", path: "/about" },
    // ];

    const supportLinks = [
        { label: "FAQ", path: "/faq" },
        { label: "Contact Us", path: "/contact" },
        { label: "Privacy Policy", path: "/privacy" },
        { label: "Terms of Service", path: "/terms" },
    ];

    return (
        <footer className={`border-t border-dashed mt-auto ${theme === "dark" ? " text-white" : " bg-gray-100 text-black"} `}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>

                    {/* Brand */}
                    <div className='flex flex-col gap-3'>
                        <button
                            className='text-2xl font-semibold text-left font-mono'
                            onClick={() => navigate('/')}
                        >
                            <span className='bg-gray-900 text-white py-1 px-2 rounded-l-xl'>Music</span>
                            <span className='bg-blue-500  py-1 px-2 rounded-r-xl'>Menia</span>
                        </button>
                        <p className={`text-sm text-gray-500 ${theme === "dark" ? "text-white" : "text-black"}`}>Discover and share amazing audio files with others.</p>

                        {/* Social Icons */}
                        <div className='flex gap-3 mt-2 flex-wrap'>
                            {socialLinks.map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`sm:text-xl md:text-sm text-sm lg:text-base hover:text-blue-400  hover:scale-110 transition-transform ${theme === "dark" ? "text-white" : "text-black"}`}
                                >
                                    {item.icon}
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    {/* <div className='flex flex-col gap-3'>
                        <h3 className='text-lg font-semibold text-yellow-300'>Quick Links</h3>
                        <ul className='flex flex-col gap-2'>
                            {quickLinks.map((link, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => navigate(link.path)}
                                    className={`cursor-pointer hover:translate-x-1 transition-transform text-sm ${theme === "dark" ? "text-white  " : "text-black"}`}
                                >
                                    → {link.label}
                                </li>
                            ))}
                        </ul>
                    </div> */}

                    {/* Support Links */}
                    <div className='flex flex-col gap-3'>
                        <h3 className='text-lg font-semibold text-yellow-300'>Support</h3>
                        <ul className='flex flex-col gap-2'>
                            {supportLinks.map((link, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => navigate(link.path)}
                                    className=' cursor-pointer hover:translate-x-1 transition-transform text-sm'
                                >
                                    → {link.label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className='flex flex-col gap-3'>
                        <h3 className='text-lg font-semibold text-yellow-300'>Stay Updated</h3>
                        <p className={`text-sm ${theme === "dark" ? "text-white" : "text-black"}`}>Subscribe to get the latest music updates.</p>
                        <input
                            type="email"
                            placeholder='Enter your email'
                            className='focus:outline-none border border-blue-400  px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <button className='bg-blue-500 hover:bg-blue-600 py-2 rounded-lg text-sm font-semibold transition-colors'>
                            Subscribe
                        </button>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className='border-t border-gray-600 mt-8 pt-8 text-center text-sm'>
                    <p>&copy; {new Date().getFullYear()} <span className='font-mono font-bold text-blue-900 bg-gray-300 rounded-xl px-2'>MusicMeniya</span>. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
