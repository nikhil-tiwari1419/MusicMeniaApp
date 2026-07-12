import React, { useEffect, useState } from 'react'
import DesktopNavbar from '../Components/DesktopNavbar'
import MobileNavbar from '../Components/Mobilenavbar'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/useAuth';
import { PUBLIC_LINKS } from './Navlinks';

export default function Navbar() {
    const [activeSection, setActiveSection] = useState('home');
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth()
    const isPublicNav = !user

    function scrollTosection(sectionId) {
        const scroll = () => {
            const element = document.getElementById(sectionId)
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }

        if (window.location.pathname !== '/') {
            navigate(`/#${sectionId}`)
            setTimeout(() => { scroll(); setActiveSection(sectionId) }, 150)
            return
        }

        setActiveSection(sectionId)
        scroll()
    }

    useEffect(() => {
        if (!isPublicNav) return
        const hash = location.hash.replace('#', '')
        if (hash) setActiveSection(hash)
    }, [location.hash, isPublicNav])

    useEffect(() => {
        if (!isPublicNav || location.pathname !== '/') return
        const sections = PUBLIC_LINKS.map(l => document.getElementById(l.section)).filter(Boolean)

        if (!sections.length) return
        const observer = new IntersectionObserver(
            entries => {
                const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
                if (visible.length) setActiveSection(visible[0].target.id)
            },
            { rootMargin: '-35% 0% -55% 0%', threshold: [0.3, 0.6] }
        )
        sections.forEach(s => observer.observe(s))
        return () => observer.disconnect()
    }, [isPublicNav, location.pathname])

    return (
        <>
            <DesktopNavbar activeSection={activeSection} scrollTosection={scrollTosection} />
            <MobileNavbar activeSection={activeSection} scrollTosection={scrollTosection} />
        </>
    )
}