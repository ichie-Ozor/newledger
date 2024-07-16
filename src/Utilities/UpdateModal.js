import React from 'react'

function UpdateModal({visible, children, close}) {
 
if(!visible) return null
return (
  <div id='container' className='fixed bg-gray-500 inset-0 bg-opacity-60 backdrop-blur-sm flex md:justify-center md:items-center'>
    <div className='relative top-12 left-0 w-[32rem] p-2 h-[11rem] bg-white rounded-xl'>
        <p className='font-bold justify-center grid'>Enter the Details you want to update here</p>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className=" absolute w-5 h-5 m-2 cursor-pointer" onClick={close}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
      {children}
    </div>
  </div>
)
}

export default UpdateModal
