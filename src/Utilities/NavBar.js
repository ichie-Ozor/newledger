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
      {/* <div className='absolute font-ms left-4 text-white font-black flex -top-10 text-2xl md:top-5 md:text-8xl'>
        J <div className='text-xl md:text-7xl top-0 md:top-2 relative -left-1 block  ml-1'>kl<span className='text-[15px] md:text-xl -top-3 relative block'>stores</span></div>
      </div> */}
      <div className='w-full h-fit mt-4'>
        <div className='justify-self-center'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="100 -1000 960 960" fill="#ffffff"
            className=" w-[120px] h-[120px] sm:w-[54px] sm:h-[54px]">
            <path d="M216-176q-45-45-70.5-104T120-402q0-63 24-124.5T222-642q35-35 86.5-60t122-39.5Q501-756 591.5-759t202.5 7q8 106 5 195t-16.5 160.5q-13.5 71.5-38 125T684-182q-53 53-112.5 77.5T450-80q-65 0-127-25.5T216-176Zm112-16q29 17 59.5 24.5T450-160q46 0 91-18.5t86-59.5q18-18 36.5-50.5t32-85Q709-426 716-500.5t2-177.5q-49-2-110.5-1.5T485-670q-61 9-116 29t-90 55q-45 45-62 89t-17 85q0 59 22.5 103.5T262-246q42-80 111-153.5T534-520q-72 63-125.5 142.5T328-192Zm0 0Zm0 0Z" />
          </svg>
          <span className="text-white text-[33px] font-bold">Ledger App</span>
        </div>
        <h6 className="italic mt-2 text-[11px] text-white">...documenting your business, faster</h6>
      </div>
      <div className='text-white flex md:block md:justify-evenly mt-16'>
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
