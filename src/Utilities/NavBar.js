import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/auth'

function NavBar({ children }) {
  const navigate = useNavigate()
  const auth = useAuth()
  const signOutHandler = () => {
    auth.logout("myToken")
    navigate('/index')
  }
  return (
    <div className='fixed grid md:h-screen md:bg-primary-500 md:w-48 md:top-0 md:justify-items-center'>
      <div className='absolute font-ms left-4 text-white font-black flex top-2 text-6xl md:top-5 md:text-8xl'>
        J <div className='text-5xl md:text-7xl top-2 relative -left-1 block '>kl<span className='text-lg md:text-xl -top-3 relative block'>stores</span></div>
      </div>
      <div className='relative hidden md:text-white  md:top-36 md:block md:justify-evenly md:h-64 '>
        <div>
          {children}
        </div>

        <div onClick={() => navigate(-1)} className='nav text-xs font-bold ml-3 mt-3 cursor-pointer'>BACK</div>
        <div className='text-xs font-bold ml-3 mt-7  cursor-pointer' onClick={signOutHandler}>
          Sign Out
        </div>
      </div>
    </div>
  )
}

export default NavBar
