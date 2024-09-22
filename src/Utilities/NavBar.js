import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/auth'

function NavBar({ children, classStyle }) {
  const navigate = useNavigate()
  const auth = useAuth()
  const signOutHandler = () => {
    auth.logout("myToken")
    navigate('/')
  }
  return (
    <div className={classStyle}>
      <div className='absolute font-ms left-4 text-white font-black flex -top-10 text-2xl md:top-5 md:text-8xl'>
        J <div className='text-xl md:text-7xl top-0 md:top-2 relative -left-1 block  ml-1'>kl<span className='text-[15px] md:text-xl -top-3 relative block'>stores</span></div>
      </div>
      <div className='relative text-white flex md:top-36 md:block md:justify-evenly md:h-64 '>
        <div>
          {children}
        </div>

        <div onClick={() => navigate(-1)} className='text-xs font-bold ml-3 mt-3 cursor-pointer'>BACK</div>
        <div className='text-xs font-bold ml-3 md:mt-7 mt-3 cursor-pointer' onClick={signOutHandler}>
          Sign Out
        </div>
      </div>
    </div>
  )
}

export default NavBar
