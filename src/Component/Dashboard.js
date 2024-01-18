import React, { useState } from 'react'
import Header from '../Utilities/Header'
import NavBar from '../Utilities/NavBar'
import CreditorModal from '../Utilities/CreditorModal'
import DebtorModal from '../Utilities/DebtorModal'
import { NavLink } from 'react-router-dom'
import DashboardModal from '../Utilities/DashboardModal'


function Dashboard() {
  const [ openCreditor, setOpenCreditor ] = useState(false)
  const [ openDebtor, setOpenDebtor ] = useState(false)
  const [ showCreditorModal, setShowCreditorModal ] = useState(false)
  const [ showDebtorModal, setShowDebtorModal ] = useState(false)
  const [ showCategoryModal, setShowCategoryModal ] = useState(false)
  const [ showCreditBalModal, setShowCreditBalModal] = useState(false)
  const [categoryTodo, setCategoryTodo] = useState()
  const [ categoryList, setCategoryList ] = useState([])

/////////////////////Category Delete//////////////////////
const deleteCategory = (id) => {
  console.log(id)
  const itemToDelete = categoryList.splice(id, 1)  //i had to do this because the mapped items do not have an id so is used splice to remove it from the array 
  const remnant = categoryList.filter((item) => item !== itemToDelete )
  setCategoryList(remnant)
  console.log(categoryList)
}

//////////Category Todo //////////////////////
const CategoryHandler = (e) => {
  e.preventDefault()
  setCategoryList((prev) => [...prev, categoryTodo])
  setCategoryTodo("")
}
console.log(categoryList)
const renderCategory = categoryList.map((item, id) => {
  console.log(item)
  return (
    <div className='flex bg-gray-100 mt-1 h-8 divide-x-4 divide-green-500'>
      <p className='w-64 h-6 bg-white m-1 pl-2 mr-2'>{item}</p>
      <button className='ml-1 pl-4 w-60 hover:bg-red-500 m-1' onClick={()=> deleteCategory(id)}>Delete</button>
    </div>
  )
})



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
      <NavBar>
        <div onClick={() => setShowCategoryModal(true)}>Category</div>
        <div onClick={() => setShowCreditBalModal(true)}>Credit Balance</div>
      </NavBar>
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
      {/***************CategoryModal*******************/}
      {showCategoryModal ? 
      <DashboardModal visible={showCategoryModal} close={() => setShowCategoryModal(false)}>
         <div className='del relative top-1  h-4/5'>
            <form onSubmit={CategoryHandler} className='catForm fixed bg-white z-30'>
              <input 
              type='text' 
              placeholder='Enter Category here' 
              className='m-1 w-80 h-10 p-2' 
              name='categoryTodo' 
              value={categoryTodo} 
              onChange={(e) => setCategoryTodo(e.target.value)}
              />
              <button className='w-14 h-10 bg-gray-200'>Enter</button>
            </form>
            <div className='catModel relative top-12'>
            {renderCategory}
            </div>
        </div>
      </DashboardModal>
      :
      <div></div>
      }
      {/*******************Credit Balance Modal*/}
      {showCreditBalModal ? 
      <DashboardModal visible={showCreditBalModal} close={() => setShowCreditBalModal(false)}>
         <div>
            Credit Balance Here
        </div>
      </DashboardModal>
      :
      <div></div>
      }
    </div>
  )
}

export default Dashboard
