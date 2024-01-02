import React, { useEffect, useState } from 'react'
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'
import axios from 'axios'


function Creditor() {
  let initialValue 
  // let initialValue2 = 0
  // const timer = Date.now()
  const baseUrl = "https://fakestoreapi.com/products";
  const [ creditor, setCreditor ] = useState([])
  // const [time, setTime] = useState(initialValue)
  const [cash, setCash] = useState(initialValue)
  const [ totalCash, setTotalCash ] = useState(0)
  const [error, setError] = useState(null)
  const [ creditorInput, setCreditorInput ] = useState({
    date: "",
    description: "",
    category: "",
    qty: "",
    rate: ""
  })

const onChange = (e) => {
  e.preventDefault()
  const { name, value } = e.target
  setCreditorInput({
    ...creditorInput, [name] : value
  })
}

  const submitHandler = (e) => {
    e.preventDefault()
   if(creditorInput.date === "" && creditorInput.category === "") return 
   setCreditor((prev) => [    //this is sent to the backend
    ...prev,
    {
      id: new Date().getMilliseconds(),
      date: creditorInput.date,
      description: creditorInput.description,
      category: creditorInput.category,
      qty: creditorInput.qty,
      rate: creditorInput.rate,
      total: creditorInput.rate * creditorInput.qty
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
  console.log(creditor)

  ////This fetches data from the backend and displays it here 
  useEffect(()=> {
    // if(timer ){                              //this is also supposed to get a timer from the context that will allow 
    //   console.log("time up")                 //if the subscription is still valid before it can be allowed to fetch from the DB
    // } else {
      axios.get(baseUrl).then((response) => {
        // setClient(() => response.data)
        setCreditor((prev) => [
          ...prev, response.data
          
    // {
    //   id: new Date().getMilliseconds(),
    //   date: creditorInput.date,
    //   description: creditorInput.description,
    //   category: creditorInput.category,
    //   qty: creditorInput.qty,
    //   rate: creditorInput.rate,
    //   total: creditorInput.rate * creditorInput.qty
    // },
        ])
      }).catch(error => {
         setError(error)
      })
    // }
  }, [])

console.log(creditor)


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


  ////////Total calculations are here////////////////////////////////
  
  const cashHandler = (e) => {
    e.preventDefault()
    setCash(e.target.value)
    //  return bal = debtorTotal - cash
  }

  const totalCashHandler = (e) => {
    e.preventDefault()
    const total = creditorTotal - cash
    setTotalCash(total)
  }
  // console.log(cash)
     
  ////////////////Total ends here///////////////////////

 const renderCreditor = creditor.map((value, id) => {
  const { date, total, description, category, qty, rate } = value;
  return (
    <>   <tr key={id} className='relative space-x-2 left-2 top-20 md:left-60 md:top-28 mt-2 flex md:space-x-4'>
      <td className='table-data'>{date}</td>
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


////////////Reducer/////////////
const reducer = (accumulator, currentValue) => {
  const returns = accumulator + Number(currentValue.total)
  // console.log(typeof returns);
  return returns
}
const creditorTotal = creditor.reduce(reducer, 0)
// console.log(creditorTotal)

  return (
    <div>
      <NavBar />
      <Header name={" Creditor Page"}/>
      <div className='absolute left top-22 '>
        <form className='relative flex  left-56' onSubmit={submitHandler}>
          <input type='date' placeholder='date'className='btn4' name='date' value={creditorInput.date} onChange={onChange}/>
          <input type='text' placeholder='Goods Description' className='btn4' name='description' value={creditorInput.description} onChange={onChange}/>
          <input type='text' placeholder='Category' className='btn4' name='category' value={creditorInput.category} onChange={onChange}/>
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
    </div>
  )
}

export default Creditor
