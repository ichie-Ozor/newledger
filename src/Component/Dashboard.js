import React, { useState } from 'react'
import Header from '../Utilities/Header'
import NavBar from '../Utilities/NavBar'
import CreditorModal from '../Utilities/CreditorModal'
import DebtorModal from '../Utilities/DebtorModal'
import { NavLink } from 'react-router-dom'


function Dashboard() {
  const [ openCreditor, setOpenCreditor ] = useState(false)
  const [ openDebtor, setOpenDebtor ] = useState(false)
  const [ showCreditorModal, setShowCreditorModal ] = useState(false)
  const [ showDebtorModal, setShowDebtorModal ] = useState(false)




  const creditorHandler = (e) => {
    e.preventDefault()
    if(!openCreditor){
    setOpenCreditor(true)
    } else setOpenCreditor(false)
  }

  const debtorHandler = (e) => {
    e.preventDefault()
    if(!openDebtor){
    setOpenDebtor(true)
    } else setOpenDebtor(false)
  }

  const handleCreditorOnClose = () => setShowCreditorModal(false)
  const handleDebtorOnClose = () => setShowDebtorModal(false)





  return (
    <div>
      <NavBar />
      <Header name={" Dashboard"}/>
       {/*******************  Main body here ***********************/}
       <div className='relative -left-64 -top-64 md:left-0'>
       <div className='absolute top-80 left-80'>
        <NavLink to='stock'><button className='btn1'>Stock</button></NavLink>
        <NavLink to='sales'><button className='btn1'>Sales</button></NavLink>
        <button className='btn1' onClick={creditorHandler}>Creditor</button>
        <button className='btn1' onClick={debtorHandler}>Debtor</button>
      </div>
      {openCreditor ? 
      <div className='creditor relative w-48 md:w-1/5 h-24 bg-white md:flex md:p-4 shadow-2xl rounded hover:shadow'>
        <div className='btn2' onClick={() => setShowCreditorModal(true)}>New Account?</div>
        <NavLink to='creditor'><div className='btn2'>Old Account?</div></NavLink>
      </div> :
      <div></div>
      }
      {openDebtor ? 
      <div className='debtor relative w-48 h-24 bg-white md:flex shadow-2xl rounded hover:shadow md:w-1/5 md:p-4'>
      <div className='btn2' onClick={() => setShowDebtorModal(true)}>New Account?</div>
      <NavLink to='debtor'><div className='btn2'>Old Account?</div></NavLink>
    </div> :
      <div></div>
      }
      <CreditorModal onClose={handleCreditorOnClose} visible={showCreditorModal}/>
      <DebtorModal onClose={handleDebtorOnClose} visible={showDebtorModal} />
      </div>
    </div>
  )
}

export default Dashboard
