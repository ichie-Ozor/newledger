import React from 'react'

function DeleteModal({visible, names, children, close}) {



if(!visible) return null
  return (
    <div id='container' className='fixed bg-red-600 inset-0 bg-opacity-60 backdrop-blur-sm flex md:justify-center md:items-center'>
      <div className='relative top-12 left-0 w-2/5 h-1/5 bg-white rounded-xl '>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6" onClick={close}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
        <span className='absolute left-32 text-red-700 text-xl font-bold'>
          Are you an admin? put in your password
        </span>
        {children}
        <p className='relative top-24 justify-center items-center flex font-bold'>Be <span className='text-red-600 font-bold ml-1 mr-1'>WARNED</span>, you might <span className='font-bold ml-1 mr-1 text-red-600'>NOT</span> recover this information again 😡😡😡</p>
      </div>
    </div>
  )
}

export default DeleteModal
