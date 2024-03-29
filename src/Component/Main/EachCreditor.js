import React, { useEffect, useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import moment from 'moment';
// import { AuthContext } from '../../Context/auth'
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'


function EachCreditor(props) {
  let initialValue 
  const [ creditor, setCreditor ] = useState([])
  const [credit, setCredit] = useState([])
  const [cash, setCash] = useState(initialValue)
  const [category, setCategory] = useState('')
  const [ totalCash, setTotalCash ] = useState(0)
  const [error, setError] = useState(null)
  const [ creditorInput, setCreditorInput ] = useState({
    date: "",
    description: "",
    category: "",
    qty: "",
    rate: ""
  })

  const location = useLocation()
  if(location.state === null){ console.log(error)}
  const eachCreditor = (location.state)
  console.log(eachCreditor)
  const {firstName, lastName,  _id, createdBy, phoneNumber} = eachCreditor
  console.log(firstName,lastName, _id, createdBy)
  // const baseUrl = `http://localhost:8080/credit/${_id}`;
  const baseUrl2 = "http://localhost:8080/credit";
  const baseUrl3 = "http://localhost:8080/creditorBal";

  // const { category, setCategory } = useContext(AuthContext)
 

 

////This fetches data from the backend and displays it here 
useEffect(()=> {
 try{
  axios.get(baseUrl2).then((response) => {
    const creditorData = response.data.creditors
    setCreditor(creditorData)
  })
 }catch(err){console.log(err.message)} 
}, [baseUrl2])


const onChange = (e) => {
  e.preventDefault()
  const { name, value } = e.target
  setCreditorInput({
    ...creditorInput, [name] : value
  })
}

  ////////Total calculations are here////////////////////////////////
  
  const cashHandler = (e) => {
    e.preventDefault()
    setCash(e.target.value)
    //  return bal = debtorTotal - cash
  }

  const totalCashHandler = (e) => {
    e.preventDefault()
    const total = creditorTotal - parseInt(cash)
    console.log(creditorTotal)
    setTotalCash(total)
  }
  console.log(totalCash, cash)
     
  ////////////////Submit and sending to the backend starts here///////////////////////

  const submitHandler = (e) => {
    e.preventDefault()
   if(creditorInput.date === "" && creditorInput.category === "") return 
   setCreditor((prev) => [    
    ...prev,
    {
      id: new Date().getMilliseconds(),
      date: creditorInput.date,
      description: creditorInput.description,
      category: category,
      qty: creditorInput.qty,
      rate: creditorInput.rate,
      total: creditorInput.rate * creditorInput.qty
    },
  ])
  
  setCredit((prev) => [    //this is sent to the backend
    ...prev,
    {
      id: new Date().getMilliseconds(),
      creditorId: _id,
      date: creditorInput.date,
      description: creditorInput.description,
      category: category,
      qty: creditorInput.qty,
      rate: Number(creditorInput.rate),
      // paid: cash,
      total: creditorInput.rate * creditorInput.qty,
      // balance: totalCash,
      businessId: createdBy
    },
  ])

  setCreditorInput({
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
  setCreditor(creditor.filter(stocks => stocks.id !== id))
}

//////////////Edit//////////////////////
const editHandler = id => {
  const editItem = creditor.find(item => item.id = id)  //this serches the array to see if the object has the id and returns the object
  
  setCreditorInput({
    ...creditorInput,
    date: editItem.date,
    description: editItem.description,
    category: editItem.category,
    qty: editItem.qty,
    rate: editItem.rate,
  })
  deleteHandler(id)
} 


////////////Reducer/////////////
const reducer = (accumulator, currentValue) => {
  const returns = accumulator + Number(currentValue.total)
  return returns
}
const creditorTotal = creditor.reduce(reducer, 0)
console.log(creditorTotal)

 
    /////////////Save to the backend//////
    const saveHandler = () => {
      const amount = {paid: cash, balance: totalCash, businessId : createdBy, creditorId : _id, phoneNumber, firstName, lastName, purchase: creditorTotal }
      // const payload = [credit, amount]
      console.log("see me, going to backend", credit, amount)
      try{
        if(credit.length === 0 ){
          return toast.error("you have not entered any new data")
        }
        if(amount.paid === undefined){
          return toast.error("You have not put in amount paid")
        }
        axios({
          method: 'post', 
          url: baseUrl2,
          data: credit
         })
         axios({
          method: 'post', 
          url: baseUrl3,
          data: amount
         })
         toast.success("Input is successfully saved at the database")
         setCredit([])
       }catch(err){
        console.log(err.message)
        toast.error("Something went wrong while trying to save, please try again later")
      } 

    }

 const renderCreditor = creditor.map((value, id) => {
  const { date, total, description, category, qty, rate } = value;
  return (
    <>   <tr key={id} className='relative space-x-2 left-2 top-10 md:left-60 md:top-28 mt-2 flex md:space-x-4'>
      <td className='table-data'>{moment(date).format('DD/MM/YYYY')}</td>
      <td className='bg-gray-200 w-26 h-10 rounded pt-2 flex justify-center text-xl md:w-72'>{description}</td>
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
      <Header name={" Creditor Page"}/>
      <div className='relative left-80 -top-12 font-bold text-3xl text-gray-600'>{firstName+""+lastName}</div>
      <div className='absolute left top-22 '>
        <form className='relative flex  left-56' onSubmit={submitHandler}>
          <input type='date' placeholder='date'className='btn4' name='date' value={creditorInput.date} onChange={onChange}/>
          <input type='text' placeholder='Goods Description' className='btn4' name='description' value={creditorInput.description} onChange={onChange}/>
          <Typeahead
          className='btn6'
          placeholder='Category'
          onChange={(selected) => {
            setCategory(selected[0]);
          }}
          options={['Animal', 'Cotton', 'Food', 'Tools',"food", "transport", "home", "fun", "health", "other"]}
        />
          {/* <input type='text' placeholder='Category' className='btn4' name='category' value={creditorInput.category} onChange={onChange}/> */}
          <input type='number' placeholder='Qty' className='btn4' name='qty' value={creditorInput.qty} onChange={onChange}/>
          <input type='number' placeholder='Rate N'className='btn4' name='rate' value={creditorInput.rate} onChange={onChange}/>
          <button type='submit' className='submit'>Submit</button>
        </form>
      </div>
      <table className='relative left-2 top-20 md:left-60 md:top-28 flex space-x-4'>
        <th className='table-header'>Date</th>
        <th className='bg-gray-200 w-26 text-xs md:w-72 h-10 rounded pt-2 md:text-lg'>Goods Description</th>
        <th className='table-header'>Category</th>
        <th className='table-header'>Quantity</th>
        <th className='table-header'>Rate</th>
        <th className='table-header'>Total</th>
      </table>
      {/* <div>{renderCreditor}</div> */}
      <div>
        {error ? error.message : renderCreditor}
      </div>

      <div className='relative float-right right-40 top-40 space-y-8 shadow-xl hover:shadow w-3/5 rounded-xl'>
        <div className='flex space-x-8'><div className='btn5'>Total: </div>
        <div className='bg-gray-200 w-72 h-10 rounded pt-2 text-center text-xl'>{creditorTotal}</div></div>
          <div className='flex space-x-8'>
            <div className='btn5'>Paid: </div>
                <input className='bg-gray-100 w-72 h-10 rounded pt-2 flex justify-center md:text-xl text-center' value={cash} name='cash' onChange={cashHandler} placeholder='Enter cash payment here'/>
                <button className='w-20 h-8 bg-gray-400 ml-2 relative left-3 top-1 rounded-md text-white font-bold text-lg shadow-xl hover:shadow hover:text-black hover:bg-white' onClick={totalCashHandler}>Click</button>
          </div>
        <div className='btn5'>Bal:</div><div className='bg-gray-100 w-72 h-10 rounded pt-2 flex justify-center text-xl relative left-32 -top-16'>{totalCash}</div>
      </div>
      <button type='submit' onClick={saveHandler} className='save'>Save</button>
    </div>
  )
}

export default EachCreditor
