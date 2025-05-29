import React, { useState, useEffect } from 'react'

// import Header from '../Utilities/Header'
// import SideBar from '../Utilities/SideBar'
import CreditorModal from '../Utilities/CreditorModal'
import DebtorModal from '../Utilities/DebtorModal'
import { NavLink } from 'react-router-dom'
// import DashboardModal from '../Utilities/DashboardModal'
import { useAuth } from '../Context/auth'
import { useSideBar } from '../Context/SideBarContext'


function Dashboard() {
  const [openCreditor, setOpenCreditor] = useState(false)
  const [openDebtor, setOpenDebtor] = useState(false)
  const [openStock, setOpenStock] = useState(false)
  const [showCreditorModal, setShowCreditorModal] = useState(false)
  const [showDebtorModal, setShowDebtorModal] = useState(false)
  const { setActiveComponent } = useSideBar()
  const auth = useAuth()
  const account_id = auth.user._id
  // const { fullName, businessName } = auth.user

  useEffect(() => {
    setActiveComponent('dashboard')
    return () => setActiveComponent(null)
  }, [setActiveComponent])
  //credit handle here
  const creditorHandler = (e) => {
    e.preventDefault()
    if (!openCreditor) {
      setOpenCreditor(true)
      setOpenDebtor(false)
      setOpenStock(false)
    } else setOpenCreditor(false)
  }

  const stockHandler = (e) => {
    e.preventDefault()
    if (!openStock) {
      setOpenStock(true)
      setOpenCreditor(false)
      setOpenDebtor(false)
    } else setOpenStock(false)
  }

  const debtorHandler = (e) => {
    e.preventDefault()
    if (!openDebtor) {
      setOpenDebtor(true)
      setOpenCreditor(false)
      setOpenStock(false)
    } else setOpenDebtor(false)
  }

  const handleCreditorOnClose = () => setShowCreditorModal(false)
  const handleDebtorOnClose = () => setShowDebtorModal(false)

  return (
    <div className=' md:ml-[15vw] md:w-[85vw] w-[100vw] p-4'>
      <div className='grid grid-cols-6 gap-2 mt-10 md:mt-0 md:gap-8 max-h-screen h-[70vh] md:h-[50vh] w-[80vw] md:w-[70vw] md:justify-self-center'>
        <NavLink to={`stock/${account_id}`} className='no-underline btn1 col-span-2 grid justify-items-center'><button className='w-full'>Stock</button></NavLink>
        <NavLink to={`sales/${account_id}`} className='no-underline btn1 col-span-2 grid justify-items-center'><button className=' w-full'>Sales</button></NavLink>
        <div className='btn1 col-span-2 grid justify-center'>
          {openCreditor ?
            (<div className='flex gap-2 md:gap-4 w-full  items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"
                onClick={() => setOpenCreditor(false)}
                className='cursor-pointer hover:text-white hover:scale-[400%] duration-500 w-10 h-10'
              >
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
              </svg>
              <div className='pr-4 md:pr-0 md:ml-4'>
                <div className='cursor-pointer' onClick={() => setShowCreditorModal(true)}>New Account?</div>
                <div className='border-b-2 border-gray-400 scale-110'></div>
                <NavLink to={`creditor/${account_id}`} className='no-underline'><div className='text-blue-200'>Old Account?</div></NavLink>
              </div>
            </div>)
            :
            <button onClick={creditorHandler} className=''>Creditor</button>}
        </div>
        <div className='btn1 col-span-3 grid justify-center'>
          {openDebtor ?
            (<div className='flex gap-2 md:gap-4 w-full  items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"
                onClick={() => setOpenDebtor(false)}
                className='cursor-pointer hover:text-white hover:scale-[400%] duration-500 w-10 h-10'
              >
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
              </svg>
              <div className='pr-4 md:pr-0 md:ml-4'>
                <div className='cursor-pointer' onClick={() => setShowDebtorModal(true)}>New Account?</div>
                <div className='border-b-2 border-gray-400 scale-110'></div>
                <NavLink to={`debtor/${account_id}`} className=' no-underline'><div className='text-blue-200'>Old Account?</div></NavLink>
              </div>
            </div>)
            :
            <button className='' onClick={debtorHandler}>Debtor</button>}
        </div>
        <button className='btn1 col-span-3'>Invoice</button>
      </div>

      <CreditorModal onClose={handleCreditorOnClose} visible={showCreditorModal} />
      <DebtorModal onClose={handleDebtorOnClose} visible={showDebtorModal} />
    </div>
  )
}

export default Dashboard
