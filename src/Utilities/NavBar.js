import React from 'react'

function NavBar({children}) {
  return (
    <div className='fixed grid md:h-screen md:bg-primary-500 md:w-48 md:top-0 md:justify-items-center'>
      <div className='absolute font-ms left-4 text-white font-black flex top-2 text-6xl md:top-5 md:text-8xl'>
         J <div className='text-5xl md:text-7xl top-2 relative -left-1 block '>kl<span className='text-lg md:text-xl -top-3 relative block'>stores</span></div>
      </div>
      <div className='relative hidden md:text-white  md:top-36 md:block md:justify-evenly md:h-64 '>
        <ul className='md:text-2xl '>
          Accounting
        </ul>
        {/* <ul className='md:text-base mt-2'>
          Statement
        </ul> */}
        {/* <ul className='md:text-base mt-2'>
          {children}
        </ul> */}
        {/* <ul className='md:text-base mt-2'>
          Debit Balance
        </ul> */}
        {/* <ul className='md:text-xl mt-2'>
          Stocks
        </ul> */}
        <ul>
          {children}
        </ul>
        <ul className='md:text-xl mt-2'>
          Sign Out
        </ul>
      </div>
    </div>
  )
}

export default NavBar
