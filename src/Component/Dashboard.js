import React, { useEffect, useState } from 'react'
import Header from '../Utilities/Header'
import NavBar from '../Utilities/NavBar'
import CreditorModal from '../Utilities/CreditorModal'
import DebtorModal from '../Utilities/DebtorModal'
import { NavLink } from 'react-router-dom'
import DashboardModal from '../Utilities/DashboardModal'
import { useAuth } from '../Context/auth'
import axios from 'axios'


function Dashboard() {
  const [ openCreditor, setOpenCreditor ] = useState(false)
  const [ openDebtor, setOpenDebtor ] = useState(false)
  const [ showCreditorModal, setShowCreditorModal ] = useState(false)
  const [ showDebtorModal, setShowDebtorModal ] = useState(false)
  const [ showCategoryModal, setShowCategoryModal ] = useState(false)
  const [ showCreditBalModal, setShowCreditBalModal] = useState(false)
  const auth = useAuth()
  const [category, setCategory] = useState([])
  const [categoryTodo, setCategoryTodo] = useState({
    name: ""
  })
  const [ categoryList, setCategoryList ] = useState([])
  const [error, setError] = useState(null)

/////////////////////Category Delete//////////////////////
const deleteCategory = (id) => {
  console.log(id)
  const itemToDelete = categoryList.splice(id, 1)  //i had to do this because the mapped items do not have an id so is used splice to remove it from the array 
  const remnant = categoryList.filter((item) => item !== itemToDelete )
  setCategoryList(remnant)
  console.log(categoryList)
}

//////////Category Todo //////////////////////
const onChange = (e) => {
  e.preventDefault()
  const { name, value } = e.target
  setCategoryTodo({
    ...categoryTodo, [name] : value
  })
}
// console.log(auth.user)
const account_id = auth.user.response.data.userDetail._id
const CategoryHandler = (e) => {
  e.preventDefault()
  // const account_id = auth.user.response.data.userDetail._id
  // console.log(categoryTodo)
  setCategoryList((prev) => [...prev, categoryTodo])
  // setCategory({account_id, categoryList})
  setCategory((prev) => [
    ...prev,
    {
    account: account_id,
    name: categoryTodo.name
  }])
  setCategoryTodo({name: ""})
  // console.log(categoryTodo)
}

// console.log(category)  //send thid to the backend for storage
const categoryUrl = "http://localhost:8080/category/"
const categoryUrl2 = `http://localhost:8080/category/${account_id}`

useEffect(() => {
  try{
    axios.get(categoryUrl).then((response) => {
       setCategoryList(response.data.categories)
    })
  }catch(err) {console.log(err.message)}
})
const sendCategory = () => {
  // const account_id = auth.user.response.data.userDetail._id
  try{
    axios({
      method: 'post',
      url: categoryUrl,
      data: category
    }).then((response) => {
      console.log("category data posted", response)
    })
  } catch (err) {console.log(err.message)}
}
// console.log(categoryList)
const renderCategory = categoryList.map((item, id) => {
  // console.log(item)
  return (
    <div className='flex bg-gray-100 mt-1 h-8 divide-x-4 divide-green-500'>
      <p className='w-64 h-6 bg-white m-1 pl-2 mr-2'>{item.name}</p>
      <button className='ml-1 pl-4 w-60 hover:bg-red-500 m-1' onClick={()=> deleteCategory(id)}>Delete</button>
    </div>
  )
})


//credit handle here
  const creditorHandler = (e) => {
    e.preventDefault()
    if(!openCreditor){
    setOpenCreditor(true)
    } else setOpenCreditor(false)
  }

  //delete handle here
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
        <NavLink to={`stock/${account_id}`} state={categoryList}><button className='btn1'>Stock</button></NavLink>
        <NavLink to={`sales/${account_id}`}><button className='btn1'>Sales</button></NavLink>
        <button className='btn1' onClick={creditorHandler}>Creditor</button>
        <button className='btn1' onClick={debtorHandler}>Debtor</button>
      </div>
      {openCreditor ? 
      <div className='creditor relative w-48 md:w-1/5 h-24 bg-white md:flex md:p-4 shadow-2xl rounded hover:shadow'>
        <div className='btn2' onClick={() => setShowCreditorModal(true)}>New Account?</div>
        <NavLink to={`creditor/${account_id}`}><div className='btn2'>Old Account?</div></NavLink>
      </div> :
      <div></div>
      }
      {openDebtor ? 
      <div className='debtor relative w-48 h-24 bg-white md:flex shadow-2xl rounded hover:shadow md:w-1/5 md:p-4'>
      <div className='btn2' onClick={() => setShowDebtorModal(true)}>New Account?</div>
      <NavLink to={`debtor/${account_id}`}><div className='btn2'>Old Account?</div></NavLink>
    </div> :
      <div></div>
      }
      <CreditorModal onClose={handleCreditorOnClose} visible={showCreditorModal}/>
      <DebtorModal onClose={handleDebtorOnClose} visible={showDebtorModal} />
      </div>
      {/***************CategoryModal*******************/}
      {showCategoryModal ? 
      <DashboardModal visible={showCategoryModal} close={() => setShowCategoryModal(false)}>
         {/* <div className='del relative top-1  h-4/5'> */}
         <div className='relative -top-2 -left-96 overflow-auto'>
            <form onSubmit={CategoryHandler} className='catForm fixed bg-white z-30'>
              <input 
              type='text' 
              placeholder='Enter Category here' 
              name='name' 
              value={categoryTodo.name} 
              // onChange={(e) => setCategoryTodo(e.target.value)}
              onChange={onChange}
              />
              <button className='w-14 h-8 bg-gray-200'>Enter</button>
            </form>
            <div className='mt-10 h-7/7'>{renderCategory}</div> 
            <button className='relative bg-green-400 w-20 h-10  border rounded-sm  mt-2' onClick={sendCategory}>Submit</button>
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
