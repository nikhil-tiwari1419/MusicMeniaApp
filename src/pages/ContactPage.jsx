import React, { useContext } from 'react'
import { useTheme } from '../Context/Theme'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/Auth'

function ContactPage() {
  const { theme } = useTheme()
  const dark = theme = 'dark'
  const path = useNavigate()
  const { user} = useContext(AuthContext)
  return (
    <div className='min-h-screen pb-6 pt-2'>
        <div>
            <h1>MusicMenia Contact Page</h1>
        <p></p>
        </div>
        <section>
            
        </section>
    </div>
  )
}

export default ContactPage