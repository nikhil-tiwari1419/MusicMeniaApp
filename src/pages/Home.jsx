import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/Auth';

function Home() {
    const path = useNavigate();
    const { user } = useAuth();
    return (
        <>
            <div className='min-h-screen '>

                <div className='border rounded m-2'>
                    <h1 className='text-center p-10 font-semibold text-xl'>Hello listener / Artist  your are Unauthorized please cleck here to login</h1>

                    <h1 className='text-6xl text-center p-5'>⚠️</h1>

                    <div className='flex flex-col justify-center items-center p-3'>

                        <button
                            className='p-2 bg-blue-300 rounded font-semibold relative flex'
                            onClick={() => path("/login")}> click to log-in</button>
                    <img
                        className='h-30 rounded flex mt-35 '
                        src="giphy.gif" alt="" />
                    </div>

                </div>
                
            </div>
        </>

    )
}

export default Home