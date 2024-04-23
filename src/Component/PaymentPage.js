import React from 'react'
import { useNavigate } from 'react-router-dom'
import bank from '../Utilities/image/uba.png'

function PaymentPage() {
    const navigate = useNavigate()
  return (
    <div className='text-center'>
      <img className='w-40 h-20 m-5' src={bank} alt='bank logo' />
      <div className='text-xl font-bold ml-12'>You are expected to make payment to:</div>
      <span className='text-xl font-bold ml-12'>Account Number:2021700264</span> <br/>
      <span className='text-xl font-bold ml-12'>Account Name: Ozoemena Simeon Uroko</span><br />
      <span className='text-xl font-bold ml-12'>Bank: UBA</span><br />
      <button className='btn3 ml-12' onClick={() => navigate("/dashboard")}>Move to Dashboard</button>
    </div>
  )
}

export default PaymentPage
