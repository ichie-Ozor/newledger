import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/auth'
import axios from 'axios'
import { toast } from 'react-toastify'
import { baseUrl } from './helper'



function DebtorModal({ visible, onClose }) {
  const auth = useAuth()
  const account_id = auth.user._id
  const navigate = useNavigate()
  const [newDebtor, setNewDebtor] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    businessName: "",
    address: ""
  })

  // this collects all the data in the input field
  const onChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setNewDebtor({
      ...newDebtor,
      [name]: value,
      createdBy: account_id
    })
  }

  // this collects the  data when you click the sibmit button
  const debtorUrl = baseUrl + "/debtor/"


  // this collects the  data when you click the sibmit button
  const onSubmitDebtorHandler = (e) => {
    e.preventDefault()
    try {
      axios({
        method: 'post',
        url: debtorUrl,
        data: newDebtor
      }).then(() => {
        toast.success("debtor posted successfully")
      })
    } catch (err) {
      console.log(err.message)
      toast.error('An error occured while trying to post the debtor')
    }


    onClose()
    setNewDebtor({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      businessName: "",
      address: ""
    })
    navigate(`debtor/${account_id}`)
  }
  // console.log('debtor', newDebtor)
  // this closes the modal when you click outside the input form
  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose()
  }
  if (!visible) return null



  return (
    <div id="container" onClick={handleOnClose} className='fixed bg-black inset-0 bg-opacity-60 backdrop-blur-sm flex md:justify-center md:items-center'>
      <div className='relative top-20 left-0 w-96 h-3/5 bg-white rounded-xl'>
        <div className='relative top-4 left-10 font-bold'>New Creditor Account</div>
        <div onClick={onClose} className='cursor-pointer relative left-80 -top-2 z-10'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <form className='grid justify-center' onSubmit={onSubmitDebtorHandler}>
          <input className='btn3' type='text' placeholder='Enter First Name' name='firstName' value={newDebtor.firstName} onChange={onChange} />
          <input className='btn3' type='text' placeholder='Enter Last Name' name='lastName' value={newDebtor.lastName} onChange={onChange} />
          <input className='btn3' type='Number' placeholder='Enter Phone Number' name='phoneNumber' value={newDebtor.phoneNumber} onChange={onChange} />
          <input className='btn3' type='text' placeholder='Enter Business Name' name='businessName' value={newDebtor.businessName} onChange={onChange} />
          <input className='btn3' type='text' placeholder='Enter Address' name='address' value={newDebtor.address} onChange={onChange} />
          <button className='w-28 h-11 bg-white relative top-24 left-28 rounded-sm -mt-12 shadow-xl hover:shadow hover:bg-slate-400 hover:text-white hover:font-bold'>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default DebtorModal
