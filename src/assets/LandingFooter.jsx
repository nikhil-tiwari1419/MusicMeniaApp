import React from 'react'
import { useTheme } from '../Context/Theme';
function LandingFooter() {

    const usefulLinks = [
        {
            id: 1,
            brand: "MusicMenia",
            label: [
                { id: 1, link: "Terms and condition's", url: "" },
                { id: 2, link: "Privacy Policy", url: "" },
                { id: 3, link: "About-Us", desc: "We are a team of music enthusiasts dedicated to providing the best music experience.In A free version of song " },
                { id: 4, link: "Contact", desc: "Address: 123 Music Street, Tune City Maharastra, India" },
            ]
        }
    ];

    const { theme } = useTheme();
    const dark = theme === "dark";
    return (
        <div className={`py-10 px-5 ${dark ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <div className='grid grid-cols-2  max-w-7xl md:max-w-xl mx-auto gap-10'>
                {usefulLinks.map(link => (
                    <div key={link.id}
                    className={`font-semibold ${dark ? "":""}`}
                    >
                        <h1>{link.brand}</h1>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default LandingFooter