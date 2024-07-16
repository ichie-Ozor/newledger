import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  const [user, setUser] = useState()
  const auth = useAuth()
  // const [category, setCategory] = useState([])
  const [categoryTodo, setCategoryTodo] = useState({
    name: ""
  })
  const [ categoryList, setCategoryList ] = useState([])
  // const [error, setError] = useState(null)
  // const authToken = localStorage.getItem("myToken")
  // console.log(authToken)

  // useEffect(() => {
  // //   console.log('object')
  //   const verifyToken = async () => {
  //         try {
  //            const verifyUrl = 'http://localhost:8080/auth/verifyToken'
  //         const response = await axios.get(verifyUrl, {
  //             headers: {
  //                 Authorization: "Bearer " + authToken
  //             }
  //         });
  //         console.log(response.data, "xxxx dashboard")
  //         auth.setUser(response.data)
  //     } catch (error) {
  //         console.log('Error verifying token', error)
  //     }
  // } 
  // verifyToken(authToken)
  // }, [authToken]);
// console.log(category)  //send thid to the backend for storage
// console.log(auth)
const account_id = auth.user._id
const {fullName, businessName} = auth.user
// console.log(account_id, auth)
const categoryUrl = "http://localhost:8080/category/"
const categoryUrl2 = `http://localhost:8080/category/${account_id}`

/////////////////////Category Delete//////////////////////
// const deleteCategory = (id) => {
//   console.log(id, 'see')
//   // const itemToDelete = categoryList.splice(id, 1)  //i had to do this because the mapped items do not have an id so is used splice to remove it from the array 
//   const remnant = categoryList.filter((item) => item._id !== id )
//   setCategoryList(remnant)
//   console.log( remnant, categoryList)

//   try{
//     axios({
//       method: 'delete',
//       url: categoryUrl2,
//       data: remnant
//     }).then((response) => {
//       console.log(response)
//     })
//   } catch(err) {
//     console.log(err.message)
//   }
// }

//////////Category Todo //////////////////////
const onChange = (e) => {
  e.preventDefault()
  const { name, value } = e.target
  setCategoryTodo({
    ...categoryTodo, [name] : value
  })
}
// console.log(auth.user)

const CategoryHandler = async (e) => {
  e.preventDefault()
  console.log(categoryTodo)
  let data = {
    account: account_id,
    name: categoryTodo.name
  }
  console.log(data)
  try{
    axios({
      method: 'post',
      url: categoryUrl,
      data: data
    }).then((response) => {
      console.log("category data posted", response)
    })
  } catch (err) {console.log(err.message)}
  // const account_id = auth.user.response.data.userDetail._id
  // console.log(categoryTodo)
  setCategoryList((prev) => [...prev, categoryTodo])
  // setCategory({account_id, categoryList})
  // setCategory((prev) => [
  //   ...prev,
  //   {
  //   account: account_id,
  //   name: categoryTodo.name
  // }])
  setCategoryTodo({name: ""})
  // console.log(categoryTodo)
}



useEffect(() => {
  try{
    axios.get(categoryUrl2).then((response) => {
      // console.log(response)
       setCategoryList(response.data.category)
    })
  }catch(err) {console.log(err.message)}
})
// const sendCategory = () => {
//   const account_id = auth.user.response.data.userDetail._id
  
// }
 const list = []
// const renderCategory = categoryList.map((item, id) => {
//   list.push(item.name)
//   return (
//     <div className='flex bg-gray-100 mt-1 h-8 divide-x-4 divide-green-500'>
//       <p className='w-64 h-6 bg-white m-1 pl-2 mr-2'>{item.name}</p>
//       <button className='ml-1 pl-4 w-60 hover:bg-red-500 m-1' onClick={()=> deleteCategory(item._id)}>Delete</button>
//     </div>
//   )
// })

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
        {/* <div onClick={() => setShowCategoryModal(true)}>Category</div> */}
        <Link to={`debtorTotal/${account_id}`} className='no-underline'><div className='text-xs font-bold ml-3 cursor-pointer text-white no-underline' >TOTAL DEBTOR STATEMENT</div></Link>
        <Link to={`creditorTotal/${account_id}`} className='no-underline'><div className='text-xs font-bold ml-3 mt-3 cursor-pointer text-white no-underline'>TOTAL CREDITOR STATEMENT</div></Link>
        {/* <div onClick={() => setShowCreditBalModal(true)}>Credit Balance</div> */}
      </NavBar>
      <Header pageTitle={" Dashboard"} name={businessName + " "+ fullName}/>
       {/*******************  Main body here ***********************/}
       <div className='relative -left-64 -top-64 md:left-0'>
       <div className='absolute top-80 left-80'>
        <NavLink to={`stock/${account_id}`} state={list}><button className='btn1'>Stock</button></NavLink>
        <NavLink to={`sales/${account_id}`} state={list}><button className='btn1'>Sales</button></NavLink>
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
      <CreditorModal onClose={handleCreditorOnClose} visible={showCreditorModal}/>
      <DebtorModal onClose={handleDebtorOnClose} visible={showDebtorModal} />
      </div>
      {/***************CategoryModal*******************/}
      {
      // showCategoryModal ? 
      // <DashboardModal visible={showCategoryModal} close={() => setShowCategoryModal(false)}>
      //    {/* <div className='del relative top-1  h-4/5'> */}
      //    <div className='relative -top-2 -left-96 overflow-auto'>
      //       <form onSubmit={CategoryHandler} className='catForm fixed bg-white z-30'>
      //         <input 
      //         type='text' 
      //         placeholder='Enter Category here' 
      //         name='name' 
      //         value={categoryTodo.name} 
      //         // onChange={(e) => setCategoryTodo(e.target.value)}
      //         onChange={onChange}
      //         />
      //         <button className='w-14 h-8 bg-gray-200'>Enter</button>
      //       </form>
      //       <div className='mt-10 h-7/7'>{renderCategory}</div> 
      //       {/* <button className='relative bg-green-400 w-20 h-10  border rounded-sm  mt-2' onClick={sendCategory}>Submit</button> */}
      //   </div>
      // </DashboardModal>
      // :
      // <div></div>
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
