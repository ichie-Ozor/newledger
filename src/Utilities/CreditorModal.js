import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/auth'



// this is an update
function CreditorModal({visible, onClose}) {
  const auth = useAuth()
  const navigate = useNavigate()
  const [ newCreditor, setNewCreditor ] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    businessName: "",
    address: ""
  })
  


  // this collects all the data in the input field and store it in state
  const onChange = (e) => {
    e.preventDefault()
    const account_id = auth.user.response.data.userDetail._id
    const { name, value } = e.target
    setNewCreditor({
      ...newCreditor, 
      [name] : value,
      createdBy: account_id
    })
  }

  

  // this collects the  data when you click the sibmit button
   const creditorUrl = "http://localhost:8080/creditor/"


  const onSubmitCreditorHandler = async (e) => {
    e.preventDefault()
    console.log("see me")
    console.log("creditor", newCreditor)
  // this pushes the creditor to the database
  try {
    axios({
      method: 'post',
      url: creditorUrl,
      data: newCreditor
    }).then((response) => {
      console.log("creditor posted successfully", response)
    })
    // const response = await axios.post(creditorUrl, newCreditor)
    // console.log("creditor data posted", response)
  } catch(err){ console.log(err.message)}

  
    onClose()
    setNewCreditor({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      businessName: "",
      address: ""
    })
    navigate('creditor')
  }





//  console.log("creditor", newCreditor)

  // this closes the modal when you click outside the input form
    const handleCreditorOnClose = (e) => {
        if(e.target.id === "container") onClose()
    }
    if(!visible) return null



  return (
    <div id="container" onClick={handleCreditorOnClose} className='fixed bg-black inset-0 bg-opacity-60 backdrop-blur-sm flex md:justify-center md:items-center'>
      <div className='relative top-20 left-0 w-96 h-3/5 bg-white rounded-xl'>
        <div className='relative top-4 left-10 font-bold'>New Creditor Account</div>
        <div onClick={onClose} className='cursor-pointer relative left-80 -top-2 z-10'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        </div>
        <form className='grid justify-center' onSubmit={onSubmitCreditorHandler}>
            <input className='btn3' type='text' placeholder='Enter First Name' name='firstName' value={newCreditor.firstName} onChange={onChange}/>
            <input className='btn3' type='text' placeholder='Enter Last Name' name='lastName' value={newCreditor.lastName} onChange={onChange}/>
            <input className='btn3' type='Number' placeholder='Enter Phone Number' name='phoneNumber' value={newCreditor.phoneNumber} onChange={onChange}/>
            <input className='btn3' type='text' placeholder='Enter Business Name' name='businessName' value={newCreditor.businessName} onChange={onChange}/>
            <input className='btn3' type='text' placeholder='Enter Address' name='address' value={newCreditor.address} onChange={onChange}/>
            <button type="submit" className='w-28 h-11 bg-white relative top-24 left-28 rounded-sm -mt-12 shadow-xl hover:shadow hover:bg-slate-400 hover:text-white hover:font-bold'>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default CreditorModal
