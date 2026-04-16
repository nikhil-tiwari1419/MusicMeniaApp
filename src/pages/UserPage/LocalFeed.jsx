import React from 'react'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
function LocalFeed() {
  const theme = useTheme();
  const dark = theme === "dark";

  useEffect(()=>{
    
  })
  return (
    <>
      <Navbar />
      <div className={`min-h-scren ${dark ? "bg-gray-800 text-white" : "text-black gray-100"}`}>

      </div>
      <Footer />
    </>
  )
}


export default LocalFeed

