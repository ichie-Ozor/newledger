import React from 'react'

function DashboardModal({visible, close, children}) {

    if(!visible) return null
  return (
    <div className='fixed bg-black inset-0 bg-opacity-60 backdrop-blur-sm flex md:justify-center md:items-center'>
        <div className='Del relative top-1 h-4/5 bg-white rounded-xl '>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className ="relative left-4 w-6 h-6 top-4" onClick={close}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
        {children}
      </div>
  )
}

export default DashboardModal
