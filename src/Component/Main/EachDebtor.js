import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment';
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'
import { useLocation, useParams } from 'react-router-dom';
import {toast} from 'react-toastify'
import axios from 'axios'
import { useAuth } from '../../Context/auth';

function EachDebtor() {
  let initialValue 
  const params = useParams()
  const auth = useAuth()
  const {fullName, businessName} = auth.user
  const { accountId, debtorId } = params
  
  const baseUrl = `http://localhost:8080/debt/${debtorId}`;
  const baseUrl2b = 'http://localhost:8080/debt';
  const baseUrl3 = "http://localhost:8080/debtorBal";
  const location = useLocation()


  const [ debtor, setDebtor ] = useState([])
  const [debt, setDebt] = useState([])
  const [cash, setCash] = useState(initialValue)
  const [category, setCategory] = useState('')
  const [ totalCash, setTotalCash ] = useState(0)
  const [error, setError] = useState(null)
  const [ debtorInput, setDebtorInput ] = useState({
    date: "",
    description: "",
    category: "",
    qty: "",
    rate: ""
  })

////This fetches data from the backend and displays it here 
useEffect(()=> {
  //////////this will fetch the data of the individual client from the DB
  axios.get(baseUrl).then((response) => {
    console.log(response.data)
    setDebtor(() => response.data.debts)
  }).catch(error => {
    console.log(error, "see the error")
    setError(error)
  })
}, [])

if(location.state === null) return
console.log(location)
const eachDebtor = (location.state)
console.log(eachDebtor)
// if(eachDebtor == null) return
const { firstName, lastName, createdBy, phoneNumber, _id} = eachDebtor

const onChange = (e) => {
  e.preventDefault()
  const { name, value } = e.target
  setDebtorInput({
    ...debtorInput, [name] : value
  })
}



  const submitHandler = (e) => {
    e.preventDefault()
    // console.log("see am here", creditorInput)
   if(debtorInput.date === "" && debtorInput.category === "") return 
   setDebtor((prev) => [
    ...prev,
    {
      id: new Date().getMilliseconds(),
      date: debtorInput.date,
      description: debtorInput.description,
      category: debtorInput.category,
      qty: debtorInput.qty,
      rate: debtorInput.rate,
      total: debtorInput.rate * debtorInput.qty
    },
  ])

  setDebt((prev) => [    //this is sent to the backend
  ...prev,
  {
    id: new Date().getMilliseconds(),
    debtorId,
    date: debtorInput.date,
    description: debtorInput.description,
    category: debtorInput.category,
    qty: debtorInput.qty,
    rate: Number(debtorInput.rate),
    // paid: cash,
    total: debtorInput.rate * debtorInput.qty,
    // balance: totalCash,
    businessId: createdBy
  },
])

  setDebtorInput({
    date: "",
    description: "",
    category: "",
    qty: "",
    rate: ""
  })
    // it should also send data to the backend from here and display it on the page at the same time
  }


  //////////////Delete/////////////
const deleteHandler = id => {
  console.log(id)
  setDebtor(debtor.filter(debtors => debtors.id !== id))
}

///////////Edit///////////////
const editHandler = id => {
  const editItem = debtor.find(item => item.id = id)  //this serches the array to see if the object has the id and returns the object
  console.log(editItem)
  setDebtorInput({
    ...debtorInput,
    date: editItem.date,
    description: editItem.description,
    category: editItem.category,
    qty: editItem.qty,
    rate: editItem.rate,
  })
  deleteHandler(id)
} 


//////////////////Category 
// console.log(category)
// setCategory("god")

  ////////Total calculations are here////////////////////////////////
  
  const cashHandler = (e) => {
    e.preventDefault()
    setCash(e.target.value)
    //  return bal = debtorTotal - cash
  }

  const totalCashHandler = (e) => {
    e.preventDefault()
    const total = debtorTotal - cash
    setTotalCash(total)
  }
   
  ////////////////Total ends here///////////////////////
  console.log(debtor)

  ////////////Reducer/////////////
const reducer = (accumulator, currentValue) => {
  const returns = accumulator + Number(currentValue.total)
  console.log(typeof returns);
  return returns
}
const debtorTotal = debtor.reduce(reducer, 0)
console.log(debtorTotal)
  
    /////////////Save to the backend//////
    const saveHandler = () => {
      const amount = {paid: cash, balance: totalCash, businessId : createdBy, debtorId : _id, phoneNumber, firstName, lastName, purchase: debtorTotal }
      // const payload = [credit, amount]
      console.log("see me, going to backend", debt, amount)
      try{
        if(debt.length === 0 ){
          return toast.error("you have not entered any new data")
        }
        if(amount.paid === undefined){
          return toast.error("You have not put in amount paid")
        }
        axios({
          method: 'post', 
          url: baseUrl2b,
          data: debt
         })
         axios({
          method: 'post', 
          url: baseUrl3,
          data: amount
         })
         toast.success("Input is successfully saved at the database")
         setDebt([])
       }catch(err){
        console.log(err.message)
        toast.error("Something went wrong while trying to save, please try again later")
      } 

    }

 const renderDebtor = debtor.map((value, id) => {
  const { total, date, description, category, qty, rate } = value;
  return (
    <>
     <tr key={id} className='relative left-2 space-x-2 md:left-60 top-20 md:top-28 mt-2 flex md:space-x-4'>
      <td className='table-header'>{moment(date).format('DD/MM/YYYY')}</td>
      <td className='bg-gray-200 w-40 h-10 rounded pt-2 flex justify-center text-xl md:w-60'>{description}</td>
      <td className='table-header'>{category}</td>
      <td className='table-header'>{qty}</td>
      <td className='table-header'>{rate}</td>
      <td className='table-header'>{total}</td>
      </tr>
      <button className='btn7a btn7 left-3' onClick={() => deleteHandler(value.id)}>Delete</button>
      <button className='btn7a btn7 left-3' onClick={() => editHandler(value.id)}>Edit</button>
    </>
  )
 })


  return (
    <div>
      <NavBar />
      <Header pageTitle={" Debtor Page"} name={businessName + " " + fullName}/>
      <div className='relative left-80 -top-12 font-bold text-3xl text-gray-600'>{firstName + " " + lastName}</div>
      <div className='absolute left top-22 '>
        <form className='relative flex  left-56' onSubmit={submitHandler}>
          <input type='date' placeholder='date'className='btn4' name='date' value={debtorInput.date} onChange={onChange}/>
          {/* <Typeahead
          key={debtor.id}
          className='btn6'
          placeholder='Category'
          onChange={(selected) => {
            setCategory(selected[0]);
          }}
          options={['Animal', 'Cotton', 'Food', 'Tools',"food", "transport", "home", "fun", "health", "other"]}
        /> */}
          <input type='text' placeholder='Category' className='btn4' name='category' value={debtorInput.category} onChange={onChange}/>
          <input type='text' placeholder='Goods Description' className='btn4' name='description' value={debtorInput.description} onChange={onChange}/>
          <input type='number' placeholder='Qty' className='btn4' name='qty' value={debtorInput.qty} onChange={onChange}/>
          <input type='number' placeholder='Rate N'className='btn4' name='rate' value={debtorInput.rate} onChange={onChange}/>
          <button type='submit' className='submit'>Submit</button>
        </form>
      </div>
      <table className='relative left-2 top-20 md:left-60 md:top-28 flex space-x-4'>
        <th className='table-header'>Date</th>
        <th className='bg-gray-200 w-40 text-xs md:text-lg md:w-60 text-center h-10 rounded pt-2'>Goods Description</th>
        <th className='table-header'>Category</th>
        <th className='table-header'>Quantity</th>
        <th className='table-header'>Rate</th>
        <th className='table-header'>Total</th>
      </table>
      <div>
      {error ? error.message : renderDebtor}
        </div>
      <div className='relative float-right right-40 top-40 space-y-8 shadow-xl hover:shadow w-3/5 rounded-xl'>
        <div className='flex space-x-8'><div className='btn5'>Total: </div>
          <div className='bg-gray-200 w-72 h-10 rounded pt-2 text-center text-xl'>{debtorTotal}</div>
        </div>
          <div className='flex space-x-8'>
            <div className='btn5'>Paid: </div>
                <input className='bg-gray-100 w-72 h-10 rounded pt-2 flex justify-center text-xl text-center' value={cash} name='cash' onChange={cashHandler} placeholder='Enter cash payment here'/>
                <button className='w-20 h-8 bg-gray-400 ml-2 relative left-32 top-1 rounded-md text-white font-bold text-lg shadow-xl hover:shadow hover:text-black hover:bg-white' onClick={totalCashHandler}>Click</button>
          </div>
        <div className='btn5'>Bal:</div><div className='bg-gray-100 h-10 rounded pt-2 flex justify-center text-xl relative left-32 -top-16 w-72'>{totalCash}</div>
      </div>
      <button type='submit' onClick={saveHandler} className='save'>Save</button>
    </div>
  )
}

export default EachDebtor
