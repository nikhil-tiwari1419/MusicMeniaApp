import React, { useState } from 'react'

function Forgot() {

    const [email,setEmail]= useState("");
    const [isEmailSent, setIsEmailSent]= useState(false);
    const [OTP,setOTP]=useState(Array(6).fill(""));
    const [newPassword,setNewPassword]= useState(false);



    

  return (
    <>
    <div className='min-h-screen '>
          <div className='w-full flex'>
            <h2>Change password</h2>
            </div>

    </div>
    </>
  )
}

export default Forgot