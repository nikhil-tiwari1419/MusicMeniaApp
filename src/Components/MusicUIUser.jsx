import React from 'react'
import RecentlyPlayed from './RecentlyPlayed'
import { ThemeProvider, useTheme } from '../Context/Theme'
function MusicUIUser() {
    const MusicWalpaper = [
        
    ]
const {theme} =  useTheme();
const dark = theme === 'dark'
    return (
        <>
            <div className={`px-10 p-2 rounded `}>
                <RecentlyPlayed />
            </div>
        </>
    )
}

export default MusicUIUser