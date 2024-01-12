import React, { useState } from 'react'

function DeleteModal({visible, names, children}) {
// const [name, setName] = useState("")


// const submitHandler = (e) => {
//   e.preventDefault()
//   console.log(e.target.value, name)
//   setName("")
// }
// names = name
// console.log(name)

if(!visible) return null
  return (
    <div id='container' className='fixed bg-red-600 inset-0 bg-opacity-60 backdrop-blur-sm flex md:justify-center md:items-center'>
      <div className='relative top-12 left-0 w-2/5 h-1/5 bg-white rounded-xl '>
        <span className='absolute left-32 text-red-700 text-xl font-bold'>
          Are you an admin? put in your password
        </span>
        {children}
        {/* <form onSubmit={submitHandler}>  
        <input placeholder='put in your password here' type='password' value={name} onChange={(e) => setName(e.target.value)} className='absolute flex left-20 rounded-sm w-3/4 border-2 p-1 top-10 pl-4'/>
        <button className='deletebtn'>Enter</button>
        </form> */}
        <p className='relative top-24 justify-center items-center flex font-bold'>Be <span className='text-red-600 font-bold ml-1 mr-1'>WARNED</span>, you might <span className='font-bold ml-1 mr-1 text-red-600'>NOT</span> recover this information again 😡😡😡</p>
      </div>
    </div>
  )
}

export default DeleteModal
