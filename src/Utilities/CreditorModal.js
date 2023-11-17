import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'



// this is an update
function CreditorModal({visible, onClose}) {
  const navigate = useNavigate()
  const [ newCreditor, setNewCreditor ] = useState({
    fName: "",
    lName: "",
    pNumber: "",
    bName: "",
    address: ""
  })

  // this collects all the data in the input field and store it in state
  const onChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setNewCreditor({
      ...newCreditor, [name] : value
    })
  }

  // this collects the  data when you click the sibmit button
  const onSubmitCreditorHandler = (e) => {
    e.preventDefault()
    
    onClose()
    setNewCreditor({
      fName: "",
      lName: "",
      pNumber: "",
      bName: "",
      address: ""
    })
    navigate('creditor')
  } 
  console.log("creditor", newCreditor)
  // this closes the modal when you click outside the input form
    const handleCreditorOnClose = (e) => {
        if(e.target.id === "container") onClose()
    }
    if(!visible) return null



  return (
    <div id="container" onClick={handleCreditorOnClose} className='fixed bg-black inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center'>
      <div className='w-96 h-3/5 bg-white rounded-xl'>
        <div className='relative top-4 left-10 font-bold'>New Creditor Account</div>
        <div onClick={onClose} className='cursor-pointer relative left-80 -top-2 z-10'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        </div>
        <form className='grid justify-center' onSubmit={onSubmitCreditorHandler}>
            <input className='btn3' type='text' placeholder='Enter First Name' name='fName' value={newCreditor.fName} onChange={onChange}/>
            <input className='btn3' type='text' placeholder='Enter Last Name' name='lName' value={newCreditor.lName} onChange={onChange}/>
            <input className='btn3' type='Number' placeholder='Enter Phone Number' name='pNumber' value={newCreditor.pNumber} onChange={onChange}/>
            <input className='btn3' type='text' placeholder='Enter Business Name' name='bName' value={newCreditor.bName} onChange={onChange}/>
            <input className='btn3' type='text' placeholder='Enter Address' name='address' value={newCreditor.address} onChange={onChange}/>
            <button className='w-28 h-11 bg-white relative top-24 left-28 rounded-sm -mt-12 shadow-xl hover:shadow hover:bg-slate-400 hover:text-white hover:font-bold'>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default CreditorModal
