import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../Utilities/Header'
import NavBar from '../Utilities/NavBar'
import CreditorModal from '../Utilities/CreditorModal'
import DebtorModal from '../Utilities/DebtorModal'
import { NavLink } from 'react-router-dom'
import DashboardModal from '../Utilities/DashboardModal'
import { useAuth } from '../Context/auth'


function Dashboard() {
  const [openCreditor, setOpenCreditor] = useState(false)
  const [openDebtor, setOpenDebtor] = useState(false)
  const [showCreditorModal, setShowCreditorModal] = useState(false)
  const [showDebtorModal, setShowDebtorModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showCreditBalModal, setShowCreditBalModal] = useState(false)
  const [user, setUser] = useState()
  const auth = useAuth()
  const [categoryTodo, setCategoryTodo] = useState({
    name: ""
  })
  const [categoryList, setCategoryList] = useState([])

  const account_id = auth.user._id
  const { fullName, businessName } = auth.user


  //credit handle here
  const creditorHandler = (e) => {
    e.preventDefault()
    if (!openCreditor) {
      setOpenCreditor(true)
    } else setOpenCreditor(false)
  }

  //delete handle here
  const debtorHandler = (e) => {
    e.preventDefault()
    if (!openDebtor) {
      setOpenDebtor(true)
    } else setOpenDebtor(false)
  }

  const handleCreditorOnClose = () => setShowCreditorModal(false)
  const handleDebtorOnClose = () => setShowDebtorModal(false)

  return (
    <div>
      <NavBar classStyle='fixed grid w-[100%] bg-slate-500 h-[50px] top-24 md:h-screen md:bg-primary-500 md:w-48 md:top-0 md:justify-items-center'>
        {/* <div onClick={() => setShowCategoryModal(true)}>Category</div> */}
        <Link to={`debtorTotal/${account_id}`} className='no-underline'><div className='text-xs font-bold ml-3 cursor-pointer text-white no-underline' >TOTAL DEBTOR STATEMENT</div></Link>
        <Link to={`creditorTotal/${account_id}`} className='no-underline'><div className='text-xs font-bold ml-3 mt-3 cursor-pointer text-white no-underline'>TOTAL CREDITOR STATEMENT</div></Link>
        {/* <div onClick={() => setShowCreditBalModal(true)}>Credit Balance</div> */}
      </NavBar>
      <Header pageTitle={" Dashboard"} name={businessName + " " + fullName} classStyle='bg-primary-200 h-36 w-[100vw] md:w-[100vw] flex' />
      {/*******************  Main body here ***********************/}
      <div className='relative -left-64 -top-64 md:left-0'>
        <div className='absolute top-80 left-80'>
          <NavLink to={`stock/${account_id}`}><button className='btn1'>Stock</button></NavLink>
          <NavLink to={`sales/${account_id}`}><button className='btn1'>Sales</button></NavLink>
          <button className='btn1' onClick={creditorHandler}>Creditor</button>
          <button className='btn1' onClick={debtorHandler}>Debtor</button>
        </div>
        {openCreditor ?
          <div className='creditor relative w-48 md:w-[20rem] h-24 bg-white md:flex md:p-2 shadow-2xl rounded hover:shadow'>
            <div className='btn2' onClick={() => setShowCreditorModal(true)}>New Account?</div>
            <NavLink to={`creditor/${account_id}`} className='no-underline'><div className='btn2'>Old Account?</div></NavLink>
          </div> :
          <div></div>
        }
        {openDebtor ?
          <div className='debtor relative w-48 h-24 bg-white md:flex shadow-2xl rounded hover:shadow md:w-[20rem] md:p-2'>
            <div className='btn2' onClick={() => setShowDebtorModal(true)}>New Account?</div>
            <NavLink to={`debtor/${account_id}`} className=' no-underline'><div className='btn2'>Old Account?</div></NavLink>
          </div> :
          <div></div>
        }
        <CreditorModal onClose={handleCreditorOnClose} visible={showCreditorModal} />
        <DebtorModal onClose={handleDebtorOnClose} visible={showDebtorModal} />
      </div>
    </div>
  )
}

export default Dashboard
